package com.sertaotickets.api.dto;

import java.math.BigDecimal;

/** Espelha {@code CompetitorCategory} do front. */
public record CategoriaCompetidorResponse(
        String id,
        String name,
        BigDecimal price,
        int maxSpots,
        int filledSpots
) {
}
