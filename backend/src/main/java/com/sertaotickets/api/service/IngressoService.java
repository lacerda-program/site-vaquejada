package com.sertaotickets.api.service;

import com.sertaotickets.api.dto.IngressoResponse;
import com.sertaotickets.api.model.Evento;
import com.sertaotickets.api.model.Ingresso;
import com.sertaotickets.api.model.ItemPedido;
import com.sertaotickets.api.model.Lote;
import com.sertaotickets.api.model.Pedido;
import com.sertaotickets.api.model.enums.TipoIngresso;
import com.sertaotickets.api.repository.IngressoRepository;
import com.sertaotickets.api.util.Cpf;
import com.sertaotickets.api.util.DataBrasileira;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** Emissão e consulta de ingressos. */
@Service
@RequiredArgsConstructor
public class IngressoService {

    private static final SecureRandom SORTEIO = new SecureRandom();
    private static final int TENTATIVAS_DE_CODIGO = 20;

    private final IngressoRepository ingressoRepository;

    @Transactional(readOnly = true)
    public List<IngressoResponse> buscarPorCpf(String cpf) {
        return ingressoRepository.findByCpfTitularOrderByEmitidoEmDesc(Cpf.normalizar(cpf)).stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<IngressoResponse> buscarPorPedido(String codigoDoPedido) {
        return ingressoRepository.findByPedidoCodigoOrderByIdAsc(codigoDoPedido).stream()
                .map(this::paraResponse)
                .toList();
    }

    /**
     * Emite um ingresso por unidade comprada. Chamado apenas de dentro da
     * transação de confirmação de pagamento.
     *
     * <p>Os dados do evento são copiados para o ingresso de propósito: o que o
     * cliente comprou não pode mudar se o organizador editar o evento depois.
     */
    public List<Ingresso> emitirPara(Pedido pedido) {
        Evento evento = pedido.getEvento();
        String periodo = DataBrasileira.periodo(evento.getDataInicio(), evento.getDataFim());
        String cidadeUf = "%s/%s".formatted(evento.getCidade(), evento.getEstado().name());
        LocalDateTime agora = LocalDateTime.now();

        List<Ingresso> emitidos = new ArrayList<>();
        for (ItemPedido item : pedido.getItens()) {
            Lote lote = item.getLote();
            for (int i = 0; i < item.getQuantidade(); i++) {
                String codigo = gerarCodigo();
                emitidos.add(Ingresso.builder()
                        .codigo(codigo)
                        .pedido(pedido)
                        .evento(evento)
                        .cpfTitular(pedido.getCpfComprador())
                        .nomeTitular(pedido.getNomeComprador())
                        .qrCodeData("VALIDATE-TICKET-%s-%d".formatted(codigo, evento.getId()))
                        .tipo(TipoIngresso.ESPECTADOR)
                        .precoPago(item.getPrecoUnitario())
                        .emitidoEm(agora)
                        .setorNome(lote.getSetor().getNome())
                        .loteNumero(lote.getNumero())
                        .eventoTitulo(evento.getTitulo())
                        .eventoParque(evento.getParque())
                        .eventoCidadeUf(cidadeUf)
                        .eventoPeriodo(periodo)
                        .build());
            }
        }
        return ingressoRepository.saveAll(emitidos);
    }

    public IngressoResponse paraResponse(Ingresso ingresso) {
        return new IngressoResponse(
                ingresso.getCodigo(),
                String.valueOf(ingresso.getEvento().getId()),
                ingresso.getEventoTitulo(),
                ingresso.getEventoPeriodo(),
                ingresso.getEventoParque(),
                ingresso.getEventoCidadeUf(),
                ingresso.getSetorNome(),
                ingresso.getPrecoPago(),
                ingresso.getNomeTitular(),
                Cpf.formatar(ingresso.getCpfTitular()),
                DataBrasileira.dataCurta(ingresso.getEmitidoEm()),
                ingresso.getQrCodeData(),
                ingresso.getTipo().getRotulo(),
                ingresso.getVaqueiroNome(),
                ingresso.getCavaloNome(),
                ingresso.getEsteiraNome(),
                ingresso.getSenhaNumero());
    }

    /** Formato ST-123456, o mesmo que o checkout do front já gera hoje. */
    private String gerarCodigo() {
        for (int tentativa = 0; tentativa < TENTATIVAS_DE_CODIGO; tentativa++) {
            String codigo = "ST-%06d".formatted(100_000 + SORTEIO.nextInt(900_000));
            if (!ingressoRepository.existsByCodigo(codigo)) {
                return codigo;
            }
        }
        throw new IllegalStateException("Não foi possível gerar um código de ingresso único.");
    }
}
