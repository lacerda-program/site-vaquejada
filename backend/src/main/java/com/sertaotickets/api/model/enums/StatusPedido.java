package com.sertaotickets.api.model.enums;

/**
 * Ciclo de vida do pedido.
 *
 * <p>O estoque é reservado já em PENDENTE e devolvido ao sair para
 * EXPIRADO ou CANCELADO, para não vender ingresso que não existe
 * durante a janela de pagamento do PIX.
 */
public enum StatusPedido {
    PENDENTE,
    PAGO,
    EXPIRADO,
    CANCELADO
}
