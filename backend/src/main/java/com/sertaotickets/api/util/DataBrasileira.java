package com.sertaotickets.api.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Formatação de data no padrão que o front já exibe hoje.
 *
 * <p>Os textos aqui não são cosméticos: {@code startDate}, {@code endDate} e
 * {@code dateRangeText} chegam ao React como strings prontas (é assim que o mock
 * em {@code data/events.ts} funciona), então o formato faz parte do contrato.
 */
public final class DataBrasileira {

    private static final Locale BR = Locale.forLanguageTag("pt-BR");

    private static final String[] MES_ABREVIADO = {
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    };

    private static final String[] MES_POR_EXTENSO = {
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    };

    private static final DateTimeFormatter DIA_MES_ANO =
            DateTimeFormatter.ofPattern("dd/MM/yyyy", BR);

    private DataBrasileira() {
    }

    /** Ex.: {@code 10 Set} — o rótulo curto do card. */
    public static String curta(LocalDate data) {
        return "%02d %s".formatted(data.getDayOfMonth(), MES_ABREVIADO[data.getMonthValue() - 1]);
    }

    /**
     * Ex.: {@code 10 a 13 de Setembro de 2026}. Quando o evento cruza o mês,
     * repete o mês em cada ponta: {@code 29 de Outubro a 01 de Novembro de 2026}.
     */
    public static String periodo(LocalDate inicio, LocalDate fim) {
        String mesInicio = MES_POR_EXTENSO[inicio.getMonthValue() - 1];
        String mesFim = MES_POR_EXTENSO[fim.getMonthValue() - 1];

        if (inicio.getMonthValue() == fim.getMonthValue() && inicio.getYear() == fim.getYear()) {
            return "%02d a %02d de %s de %d".formatted(
                    inicio.getDayOfMonth(), fim.getDayOfMonth(), mesInicio, fim.getYear());
        }
        return "%02d de %s a %02d de %s de %d".formatted(
                inicio.getDayOfMonth(), mesInicio,
                fim.getDayOfMonth(), mesFim, fim.getYear());
    }

    /** Ex.: {@code 27/08/2026} — mesmo resultado do {@code toLocaleDateString('pt-BR')}. */
    public static String dataCurta(LocalDateTime momento) {
        return momento.format(DIA_MES_ANO);
    }
}
