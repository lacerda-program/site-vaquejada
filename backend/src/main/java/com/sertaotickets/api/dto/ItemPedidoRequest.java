package com.sertaotickets.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * O cliente escolhe o <b>setor</b>, nunca o lote: qual lote está valendo é decisão
 * do servidor. Assim ninguém compra num lote antigo mandando o id na mão.
 */
public record ItemPedidoRequest(

        @NotNull(message = "Informe o setor.")
        Long setorId,

        @Positive(message = "A quantidade deve ser maior que zero.")
        @Max(value = 10, message = "Máximo de 10 ingressos por setor.")
        int quantidade
) {
}
