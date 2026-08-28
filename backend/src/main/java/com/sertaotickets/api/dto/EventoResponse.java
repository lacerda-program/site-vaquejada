package com.sertaotickets.api.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Espelha {@code VaquejadaEvent} do front, campo a campo — inclusive os nomes em
 * inglês, para o React consumir a API sem camada de tradução.
 *
 * <p>Atenção às datas: {@code startDate}/{@code endDate} são rótulos curtos
 * ({@code "10 Set"}), não ISO. É o formato que a UI já imprime direto na tela.
 */
public record EventoResponse(
        String id,
        String title,
        String park,
        String city,
        String state,
        String startDate,
        String endDate,
        String dateRangeText,
        String imageUrl,
        String bannerUrl,
        List<String> lineup,
        BigDecimal startingPrice,
        List<SetorResponse> sectors,
        List<CategoriaCompetidorResponse> competitorCategories,
        List<String> categories,
        boolean certifiedAbva,
        boolean certifiedAbqm,
        String description
) {
}
