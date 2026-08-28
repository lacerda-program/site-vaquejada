package com.sertaotickets.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.util.List;

/**
 * Checkout. Os DTOs de pedido usam nomes em português porque não têm contraparte
 * em {@code types.ts} — o front hoje simula o pagamento no cliente.
 */
public record PedidoRequest(

        @NotNull(message = "Informe o evento.")
        Long eventoId,

        @NotBlank(message = "Informe o nome completo do comprador.")
        @Size(max = 120, message = "Nome muito longo.")
        String nomeComprador,

        @NotBlank(message = "Informe o CPF.")
        @CPF(message = "CPF inválido.")
        String cpf,

        @NotBlank(message = "Informe o WhatsApp para envio dos ingressos.")
        @Size(min = 10, max = 20, message = "WhatsApp inválido.")
        String whatsapp,

        @NotEmpty(message = "Selecione ao menos um ingresso.")
        @Valid
        List<ItemPedidoRequest> itens
) {
}
