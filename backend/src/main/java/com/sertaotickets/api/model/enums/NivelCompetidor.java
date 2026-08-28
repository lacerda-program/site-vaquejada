package com.sertaotickets.api.model.enums;

/**
 * Níveis de disputa da vaquejada. Cada nível tem 50 senhas por evento.
 */
public enum NivelCompetidor {
    INICIANTE("Iniciante"),
    ASPIRANTE("Aspirante"),
    PROFISSIONAL("Profissional");

    private final String rotulo;

    NivelCompetidor(String rotulo) {
        this.rotulo = rotulo;
    }

    public String getRotulo() {
        return rotulo;
    }
}
