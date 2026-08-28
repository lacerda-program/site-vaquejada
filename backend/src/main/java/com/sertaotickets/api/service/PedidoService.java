package com.sertaotickets.api.service;

import com.sertaotickets.api.dto.IngressoResponse;
import com.sertaotickets.api.dto.ItemPedidoRequest;
import com.sertaotickets.api.dto.ItemPedidoResponse;
import com.sertaotickets.api.dto.PedidoRequest;
import com.sertaotickets.api.dto.PedidoResponse;
import com.sertaotickets.api.exception.PedidoExpiradoException;
import com.sertaotickets.api.exception.RecursoNaoEncontradoException;
import com.sertaotickets.api.exception.RegraDeNegocioException;
import com.sertaotickets.api.model.Evento;
import com.sertaotickets.api.model.ItemPedido;
import com.sertaotickets.api.model.Lote;
import com.sertaotickets.api.model.Pedido;
import com.sertaotickets.api.model.Setor;
import com.sertaotickets.api.model.enums.StatusPedido;
import com.sertaotickets.api.repository.PedidoRepository;
import com.sertaotickets.api.repository.SetorRepository;
import com.sertaotickets.api.util.Cpf;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Fluxo de compra: reserva o estoque na criação do pedido, segura por uma janela
 * curta e emite os ingressos quando o pagamento é confirmado.
 *
 * <p>A reserva já em PENDENTE é deliberada — sem ela, dois compradores veem o
 * mesmo ingresso disponível durante os dez minutos do PIX e um dos dois paga por
 * algo que não existe mais.
 */
@Service
@RequiredArgsConstructor
public class PedidoService {

    private static final Logger log = LoggerFactory.getLogger(PedidoService.class);

    private static final SecureRandom SORTEIO = new SecureRandom();
    /** Sem I, O, 0 e 1: o código é ditado por telefone no atendimento. */
    private static final String ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int TENTATIVAS_DE_CODIGO = 20;

    private final PedidoRepository pedidoRepository;
    private final SetorRepository setorRepository;
    private final EventoService eventoService;
    private final LoteService loteService;
    private final IngressoService ingressoService;

    /** Casa com o contador do checkout no front. */
    @Value("${app.pedido.minutos-para-pagar:10}")
    private int minutosParaPagar;

    /** Mesmo teto do seletor de quantidade da tela de evento. */
    @Value("${app.pedido.limite-ingressos-por-cpf:10}")
    private int limiteIngressosPorCpf;

    @Transactional
    public PedidoResponse criar(PedidoRequest requisicao) {
        Evento evento = eventoService.buscarEntidade(requisicao.eventoId());
        String cpf = Cpf.normalizar(requisicao.cpf());
        LocalDateTime agora = LocalDateTime.now();

        Map<Long, Integer> quantidadePorSetor = agruparPorSetor(requisicao.itens());
        int totalDoPedido = quantidadePorSetor.values().stream().mapToInt(Integer::intValue).sum();
        validarLimitePorCpf(evento, cpf, totalDoPedido, agora);

        Pedido pedido = Pedido.builder()
                .codigo(gerarCodigo())
                .evento(evento)
                .nomeComprador(requisicao.nomeComprador().trim())
                .cpfComprador(cpf)
                .whatsapp(requisicao.whatsapp().trim())
                .status(StatusPedido.PENDENTE)
                .valorTotal(BigDecimal.ZERO)
                .criadoEm(agora)
                .expiraEm(agora.plusMinutes(minutosParaPagar))
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<Long, Integer> escolha : quantidadePorSetor.entrySet()) {
            Setor setor = setorRepository.findByIdAndEventoId(escolha.getKey(), evento.getId())
                    .orElseThrow(() -> RecursoNaoEncontradoException.setor(escolha.getKey()));

            Lote lote = loteService.loteParaVenda(setor);
            loteService.reservar(lote, escolha.getValue());

            ItemPedido item = ItemPedido.builder()
                    .lote(lote)
                    .quantidade(escolha.getValue())
                    .precoUnitario(lote.getPreco())
                    .build();
            pedido.adicionarItem(item);
            total = total.add(item.getSubtotal());
        }

        pedido.setValorTotal(total.setScale(2, RoundingMode.HALF_UP));
        pedido.setPixCopiaECola(gerarPixSimulado(pedido));
        pedidoRepository.save(pedido);

        log.info("Pedido {} criado: {} ingresso(s) do evento {} por R$ {}",
                pedido.getCodigo(), totalDoPedido, evento.getId(), pedido.getValorTotal());
        return paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse consultar(String codigo) {
        Pedido pedido = buscar(codigo);
        expirarSeVencido(pedido);
        return paraResponse(pedido);
    }

    /**
     * Confirma o PIX simulado e emite os ingressos.
     *
     * <p>Idempotente por desenho: o front faz polling do checkout e pode chamar
     * isto mais de uma vez. Pedido já pago devolve os mesmos ingressos, sem emitir
     * nada novo.
     */
    @Transactional
    public PedidoResponse confirmarPagamento(String codigo) {
        Pedido pedido = buscar(codigo);

        if (pedido.getStatus() == StatusPedido.PAGO) {
            return paraResponse(pedido);
        }
        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new RegraDeNegocioException("O pedido %s foi cancelado.".formatted(codigo));
        }
        expirarSeVencido(pedido);
        if (pedido.getStatus() == StatusPedido.EXPIRADO) {
            throw new PedidoExpiradoException(codigo);
        }

        pedido.setStatus(StatusPedido.PAGO);
        pedido.setPagoEm(LocalDateTime.now());
        ingressoService.emitirPara(pedido);

        log.info("Pedido {} pago. {} ingresso(s) emitido(s).",
                codigo, pedido.quantidadeTotalIngressos());
        return paraResponse(pedido);
    }

    /**
     * Varre os pedidos que estouraram o prazo e devolve o estoque.
     *
     * <p>Existe além da expiração sob demanda porque o estoque preso não pode
     * depender de alguém abrir a tela do pedido vencido para ser liberado.
     */
    @Transactional
    public int expirarPendentesVencidos() {
        List<Pedido> vencidos = pedidoRepository.findByStatusAndExpiraEmBefore(
                StatusPedido.PENDENTE, LocalDateTime.now());

        vencidos.forEach(this::expirar);
        if (!vencidos.isEmpty()) {
            log.info("{} pedido(s) expirado(s); estoque devolvido.", vencidos.size());
        }
        return vencidos.size();
    }

    // --- internos ---

    private Pedido buscar(String codigo) {
        return pedidoRepository.findByCodigo(codigo)
                .orElseThrow(() -> RecursoNaoEncontradoException.pedido(codigo));
    }

    private void expirarSeVencido(Pedido pedido) {
        if (pedido.estaExpirado(LocalDateTime.now())) {
            expirar(pedido);
        }
    }

    private void expirar(Pedido pedido) {
        pedido.getItens().forEach(item -> loteService.devolver(item.getLote(), item.getQuantidade()));
        pedido.setStatus(StatusPedido.EXPIRADO);
    }

    /**
     * O mesmo setor pode chegar repetido no corpo da requisição; somar antes de
     * validar impede que alguém fure o limite dividindo a compra em linhas.
     */
    private Map<Long, Integer> agruparPorSetor(List<ItemPedidoRequest> itens) {
        Map<Long, Integer> agrupado = new LinkedHashMap<>();
        itens.forEach(item -> agrupado.merge(item.setorId(), item.quantidade(), Integer::sum));
        return agrupado;
    }

    private void validarLimitePorCpf(Evento evento, String cpf, int quantidade, LocalDateTime agora) {
        int jaReservados = pedidoRepository.somarIngressosDoCpfNoEvento(
                evento.getId(), cpf, StatusPedido.PAGO, StatusPedido.PENDENTE, agora);

        if (jaReservados + quantidade > limiteIngressosPorCpf) {
            throw new RegraDeNegocioException(
                    "Limite de %d ingressos por CPF neste evento. Você já tem %d."
                            .formatted(limiteIngressosPorCpf, jaReservados));
        }
    }

    private PedidoResponse paraResponse(Pedido pedido) {
        long segundosRestantes = pedido.getStatus() == StatusPedido.PENDENTE
                ? Math.max(0, Duration.between(LocalDateTime.now(), pedido.getExpiraEm()).getSeconds())
                : 0;

        List<IngressoResponse> ingressos = pedido.getStatus() == StatusPedido.PAGO
                ? ingressoService.buscarPorPedido(pedido.getCodigo())
                : null;

        List<ItemPedidoResponse> itens = pedido.getItens().stream()
                .map(item -> new ItemPedidoResponse(
                        item.getLote().getSetor().getId(),
                        item.getLote().getSetor().getNome(),
                        item.getLote().getNumero(),
                        item.getQuantidade(),
                        item.getPrecoUnitario(),
                        item.getSubtotal()))
                .toList();

        return new PedidoResponse(
                pedido.getCodigo(),
                pedido.getStatus().name(),
                pedido.getEvento().getId(),
                pedido.getEvento().getTitulo(),
                pedido.getValorTotal(),
                pedido.getCriadoEm(),
                pedido.getExpiraEm(),
                segundosRestantes,
                pedido.getPixCopiaECola(),
                itens,
                ingressos);
    }

    private String gerarCodigo() {
        for (int tentativa = 0; tentativa < TENTATIVAS_DE_CODIGO; tentativa++) {
            StringBuilder sufixo = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sufixo.append(ALFABETO_CODIGO.charAt(SORTEIO.nextInt(ALFABETO_CODIGO.length())));
            }
            String codigo = "PED-" + sufixo;
            if (!pedidoRepository.existsByCodigo(codigo)) {
                return codigo;
            }
        }
        throw new IllegalStateException("Não foi possível gerar um código de pedido único.");
    }

    /**
     * Payload PIX de mentira, com a cara de um "copia e cola" para a tela poder
     * exibir e copiar. Não é registrado em banco nenhum — a integração com PSP
     * real está fora do escopo, como no checkout simulado do front.
     */
    private String gerarPixSimulado(Pedido pedido) {
        String valor = pedido.getValorTotal().setScale(2, RoundingMode.HALF_UP).toPlainString();
        String txid = pedido.getCodigo().replace("-", "");
        return "00020126580014BR.GOV.BCB.PIX0136%s5204000053039865%02d%s5802BR5913SERTAOTICKETS6009SAO PAULO62%02d05%s6304SIMU"
                .formatted(UUID.randomUUID(), valor.length(), valor, txid.length() + 4, txid);
    }
}
