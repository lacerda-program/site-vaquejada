package com.sertaotickets.api.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
        Long setorId,
        String setorNome,
        int loteNumero,
        int quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
) {
}
