package com.sertaotickets.api.controller;

import com.sertaotickets.api.dto.PedidoRequest;
import com.sertaotickets.api.dto.PedidoResponse;
import com.sertaotickets.api.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

/**
 * Checkout. Público de propósito: não há cadastro de usuário no projeto, e exigir
 * login para comprar mataria a conversão. O que protege o pedido é o código
 * sorteado, não previsível a partir do id.
 */
@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponse> criar(@Valid @RequestBody PedidoRequest requisicao,
                                                UriComponentsBuilder uriBuilder) {
        PedidoResponse pedido = pedidoService.criar(requisicao);
        URI local = uriBuilder.path("/api/pedidos/{codigo}").build(pedido.codigo());
        return ResponseEntity.created(local).body(pedido);
    }

    /** Usado pelo polling do checkout enquanto o contador do PIX corre. */
    @GetMapping("/{codigo}")
    public PedidoResponse consultar(@PathVariable String codigo) {
        return pedidoService.consultar(codigo);
    }

    /** Confirma o PIX simulado e emite os ingressos. Chamar de novo não duplica. */
    @PostMapping("/{codigo}/pagamento")
    public PedidoResponse pagar(@PathVariable String codigo) {
        return pedidoService.confirmarPagamento(codigo);
    }
}
