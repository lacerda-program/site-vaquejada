package com.sertaotickets.api.exception;

/**
 * Vira 409. Pedido legítimo, só que o ingresso acabou — inclusive quando duas
 * compras concorrentes disputam o mesmo lote e a segunda perde no lock otimista.
 */
public class EstoqueInsuficienteException extends RuntimeException {

    public EstoqueInsuficienteException(String mensagem) {
        super(mensagem);
    }

    public static EstoqueInsuficienteException doSetor(String setor, int disponivel) {
        return new EstoqueInsuficienteException(disponivel == 0
                ? "O setor \"%s\" está esgotado.".formatted(setor)
                : "Restam apenas %d ingresso(s) no setor \"%s\".".formatted(disponivel, setor));
    }
}
