package com.sertaotickets.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Estado do pedido. Serve tanto para a criação quanto para o polling do checkout.
 *
 * <p>{@code segundosRestantes} vai pronto para alimentar o contador de 10 minutos
 * da tela — o front não precisa comparar relógios com o servidor.
 * {@code ingressos} só aparece depois do pagamento confirmado.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PedidoResponse(
        String codigo,
        String status,
        Long eventoId,
        String eventoTitulo,
        BigDecimal valorTotal,
        LocalDateTime criadoEm,
        LocalDateTime expiraEm,
        long segundosRestantes,
        String pixCopiaECola,
        List<ItemPedidoResponse> itens,
        List<IngressoResponse> ingressos
) {
}
