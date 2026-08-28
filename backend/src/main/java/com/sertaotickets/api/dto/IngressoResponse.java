package com.sertaotickets.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

/**
 * Espelha {@code PurchasedTicket} do front.
 *
 * <p>Os quatro últimos campos só existem em ingresso de competidor e são omitidos
 * do JSON quando nulos, como o tipo opcional do TypeScript espera.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record IngressoResponse(
        String id,
        String eventId,
        String eventTitle,
        String eventDateText,
        String parkName,
        String cityState,
        String sectorName,
        BigDecimal price,
        String attendeeName,
        String attendeeCpf,
        String purchaseDate,
        String qrCodeData,
        String ticketType,
        String vaqueiroName,
        String cavaloName,
        String esteiraName,
        Integer senhaNumber
) {
}
