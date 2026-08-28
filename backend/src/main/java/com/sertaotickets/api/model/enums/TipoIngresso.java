package com.sertaotickets.api.model.enums;

/**
 * Distingue o público pagante do vaqueiro inscrito na disputa.
 * Só COMPETIDOR preenche vaqueiro, cavalo, esteira e senha.
 */
public enum TipoIngresso {
    ESPECTADOR("spectator"),
    COMPETIDOR("competitor");

    /** Valor exato aceito por {@code PurchasedTicket.ticketType} no front. */
    private final String rotulo;

    TipoIngresso(String rotulo) {
        this.rotulo = rotulo;
    }

    public String getRotulo() {
        return rotulo;
    }
}
