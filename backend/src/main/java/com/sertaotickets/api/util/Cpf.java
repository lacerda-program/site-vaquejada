package com.sertaotickets.api.util;

/** CPF trafega formatado na API e é guardado só com os 11 dígitos. */
public final class Cpf {

    private Cpf() {
    }

    /** Remove pontos, traços e espaços. Nulo continua nulo. */
    public static String normalizar(String cpf) {
        return cpf == null ? null : cpf.replaceAll("\\D", "");
    }

    /** Devolve {@code 111.444.777-35} a partir dos 11 dígitos. */
    public static String formatar(String cpfNormalizado) {
        if (cpfNormalizado == null || cpfNormalizado.length() != 11) {
            return cpfNormalizado;
        }
        return "%s.%s.%s-%s".formatted(
                cpfNormalizado.substring(0, 3),
                cpfNormalizado.substring(3, 6),
                cpfNormalizado.substring(6, 9),
                cpfNormalizado.substring(9));
    }
}
