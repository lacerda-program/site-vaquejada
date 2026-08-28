package com.sertaotickets.api.controller;

import com.sertaotickets.api.dto.IngressoResponse;
import com.sertaotickets.api.service.IngressoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Carteira de ingressos. Rota protegida: consultar por CPF expõe dado pessoal de
 * terceiro e não pode ficar aberta na internet.
 */
@RestController
@RequestMapping("/api/ingressos")
@RequiredArgsConstructor
public class IngressoController {

    private final IngressoService ingressoService;

    /** Aceita o CPF com ou sem máscara — a normalização é feita no serviço. */
    @GetMapping("/cpf/{cpf}")
    public List<IngressoResponse> porCpf(@PathVariable String cpf) {
        return ingressoService.buscarPorCpf(cpf);
    }
}
