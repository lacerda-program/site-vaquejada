package com.sertaotickets.api.exception;

/**
 * Vira 422. A requisição está bem formada, mas fere uma regra da vaquejada —
 * limite de ingressos por CPF, pedido já cancelado, setor sem lote aberto.
 */
public class RegraDeNegocioException extends RuntimeException {

    public RegraDeNegocioException(String mensagem) {
        super(mensagem);
    }
}
