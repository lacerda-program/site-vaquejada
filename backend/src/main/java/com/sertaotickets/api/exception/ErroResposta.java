package com.sertaotickets.api.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Corpo único de erro da API. {@code campos} só aparece no JSON quando há
 * violação de validação, para não poluir o resto.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErroResposta(
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem,
        String caminho,
        Map<String, String> campos
) {

    public static ErroResposta de(int status, String erro, String mensagem, String caminho) {
        return new ErroResposta(LocalDateTime.now(), status, erro, mensagem, caminho, null);
    }

    public static ErroResposta comCampos(int status, String erro, String mensagem,
                                         String caminho, Map<String, String> campos) {
        return new ErroResposta(LocalDateTime.now(), status, erro, mensagem, caminho, campos);
    }
}
