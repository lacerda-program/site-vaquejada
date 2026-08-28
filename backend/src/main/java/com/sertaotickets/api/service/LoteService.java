package com.sertaotickets.api.service;

import com.sertaotickets.api.dto.SetorResponse;
import com.sertaotickets.api.exception.EstoqueInsuficienteException;
import com.sertaotickets.api.exception.RegraDeNegocioException;
import com.sertaotickets.api.model.Evento;
import com.sertaotickets.api.model.Lote;
import com.sertaotickets.api.model.Setor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.Optional;

/**
 * Onde mora a regra de lote. Nada disso é persistido: preço, número do lote e
 * status de escassez são sempre derivados do estoque atual, senão o card da home
 * dessincroniza no minuto em que um lote vira.
 */
@Service
public class LoteService {

    /** Abaixo desta fatia do lote, a UI passa a avisar que está acabando. */
    private static final double FRACAO_ALERTA = 0.10;

    /** Piso absoluto: 15 ingressos acendem o alerta mesmo em lote grande. */
    private static final int UNIDADES_ALERTA = 15;

    public static final String STATUS_NORMAL = "normal";
    public static final String STATUS_ACABANDO = "ending";
    public static final String STATUS_ESGOTADO = "soldout";

    /**
     * Lote que o comprador leva ao escolher este setor agora.
     *
     * @throws EstoqueInsuficienteException se o setor esgotou
     * @throws RegraDeNegocioException      se o setor foi cadastrado sem lote
     */
    public Lote loteParaVenda(Setor setor) {
        if (setor.getLotes().isEmpty()) {
            throw new RegraDeNegocioException(
                    "O setor \"%s\" ainda não tem lote aberto para venda.".formatted(setor.getNome()));
        }
        return setor.loteVigente()
                .orElseThrow(() -> EstoqueInsuficienteException.doSetor(setor.getNome(), 0));
    }

    /** Baixa o estoque. O {@code @Version} do lote resolve a corrida entre dois checkouts. */
    public void reservar(Lote lote, int quantidade) {
        if (!lote.comportaVenda(quantidade)) {
            throw EstoqueInsuficienteException.doSetor(
                    lote.getSetor().getNome(), lote.getQuantidadeRestante());
        }
        lote.reservar(quantidade);
    }

    public void devolver(Lote lote, int quantidade) {
        lote.devolver(quantidade);
    }

    public String statusDoLote(Lote lote) {
        int restante = lote.getQuantidadeRestante();
        if (restante == 0 || !lote.isAtivo()) {
            return STATUS_ESGOTADO;
        }
        boolean poucoRestante = restante <= UNIDADES_ALERTA
                || restante <= lote.getQuantidadeTotal() * FRACAO_ALERTA;
        return poucoRestante ? STATUS_ACABANDO : STATUS_NORMAL;
    }

    public SetorResponse paraResponse(Setor setor) {
        Optional<Lote> vigente = setor.loteVigente();

        // Esgotado: mantém o preço e o número do último lote na tela, para o card
        // não aparecer vazio enquanto o setor segue listado.
        Lote referencia = vigente.or(setor::ultimoLote).orElse(null);
        if (referencia == null) {
            return new SetorResponse(String.valueOf(setor.getId()), setor.getNome(),
                    BigDecimal.ZERO, 0, STATUS_ESGOTADO, 0, setor.getDescricao());
        }

        String status = vigente.map(this::statusDoLote).orElse(STATUS_ESGOTADO);
        // O front só usa ticketsLeft para o aviso de escassez; em lote normal o
        // número fica omitido de propósito, para não virar contador público.
        Integer restantes = STATUS_NORMAL.equals(status) ? null : referencia.getQuantidadeRestante();

        return new SetorResponse(
                String.valueOf(setor.getId()),
                setor.getNome(),
                referencia.getPreco(),
                referencia.getNumero(),
                status,
                restantes,
                setor.getDescricao());
    }

    /**
     * O "a partir de" da vitrine. Setor exclusivo de competidor fica de fora:
     * o público geral não pode comprar aquele ingresso, então anunciá-lo como
     * menor preço seria propaganda enganosa.
     */
    public BigDecimal precoInicial(Evento evento) {
        return evento.getSetores().stream()
                .filter(setor -> !setor.isExclusivoCompetidor())
                .map(setor -> setor.loteVigente().or(setor::ultimoLote))
                .flatMap(Optional::stream)
                .map(Lote::getPreco)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);
    }
}
