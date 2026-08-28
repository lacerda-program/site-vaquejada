package com.sertaotickets.api.model.enums;

/**
 * Unidades federativas atendidas pelo circuito de vaquejadas.
 * A sigla é o próprio nome da constante, para casar com o campo `state` do front.
 */
public enum Estado {
    BA("Bahia"),
    PE("Pernambuco"),
    SE("Sergipe"),
    CE("Ceará"),
    AL("Alagoas"),
    RN("Rio Grande do Norte"),
    PB("Paraíba"),
    PI("Piauí"),
    MA("Maranhão");

    private final String nomeCompleto;

    Estado(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }
}
