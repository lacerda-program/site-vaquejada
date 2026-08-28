package com.sertaotickets.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

/**
 * Espelha {@code TicketSector} do front.
 *
 * <p>{@code price} e {@code batch} vêm do lote vigente, não do setor.
 * {@code ticketsLeft} só é enviado quando o estoque está apertado — a UI usa a
 * presença do campo para decidir se mostra o aviso de escassez.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record SetorResponse(
        String id,
        String name,
        BigDecimal price,
        int batch,
        String batchStatus,
        Integer ticketsLeft,
        String description
) {
}
