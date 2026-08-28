package com.sertaotickets.api.exception;

/** Vira 410 Gone. O PIX não foi pago dentro dos 10 minutos e o estoque já voltou. */
public class PedidoExpiradoException extends RuntimeException {

    public PedidoExpiradoException(String codigo) {
        super("O prazo de pagamento do pedido %s expirou. Refaça a compra.".formatted(codigo));
    }
}
