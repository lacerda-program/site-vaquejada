package com.sertaotickets.api.config;

import com.sertaotickets.api.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * Devolve à venda o estoque preso por PIX que ninguém pagou.
 *
 * <p>Roda por tempo, e não só quando alguém abre a tela do pedido vencido: o
 * ingresso não pode ficar bloqueado esperando o comprador que desistiu voltar.
 */
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class AgendamentoConfig {

    private final PedidoService pedidoService;

    @Scheduled(fixedDelayString = "${app.pedido.intervalo-expiracao-ms:60000}",
            initialDelayString = "${app.pedido.intervalo-expiracao-ms:60000}")
    public void liberarEstoqueDePedidosVencidos() {
        pedidoService.expirarPendentesVencidos();
    }
}
