package com.sertaotickets.api.model.enums;

import java.util.Arrays;
import java.util.Optional;

/**
 * Trilhas de vitrine da home. O rótulo é o texto exato que o front espera
 * em `VaquejadaEvent.categories`.
 */
public enum CategoriaEvento {
    PROXIMOS_EVENTOS("Próximos Eventos"),
    GRANDES_CIRCUITOS("Grandes Circuitos"),
    VAQUEJADAS_DO_MES("Vaquejadas do Mês");

    private final String rotulo;

    CategoriaEvento(String rotulo) {
        this.rotulo = rotulo;
    }

    public String getRotulo() {
        return rotulo;
    }

    /**
     * Aceita tanto o nome da constante ({@code GRANDES_CIRCUITOS}) quanto o
     * rótulo exibido ({@code "Grandes Circuitos"}), já que o filtro chega via query string.
     */
    public static Optional<CategoriaEvento> deTexto(String texto) {
        if (texto == null || texto.isBlank()) {
            return Optional.empty();
        }
        return Arrays.stream(values())
                .filter(c -> c.name().equalsIgnoreCase(texto) || c.rotulo.equalsIgnoreCase(texto.trim()))
                .findFirst();
    }
}
