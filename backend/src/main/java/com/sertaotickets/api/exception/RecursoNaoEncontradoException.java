package com.sertaotickets.api.exception;

/** Vira 404. Use quando o id/código pedido simplesmente não existe. */
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }

    public static RecursoNaoEncontradoException evento(Long id) {
        return new RecursoNaoEncontradoException("Evento %d não encontrado.".formatted(id));
    }

    public static RecursoNaoEncontradoException setor(Long id) {
        return new RecursoNaoEncontradoException("Setor %d não encontrado neste evento.".formatted(id));
    }

    public static RecursoNaoEncontradoException pedido(String codigo) {
        return new RecursoNaoEncontradoException("Pedido %s não encontrado.".formatted(codigo));
    }
}
