package com.sertaotickets.api.controller;

import com.sertaotickets.api.dto.EventoResponse;
import com.sertaotickets.api.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Catálogo público. Nenhuma rota daqui exige autenticação. */
@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    /** Os três filtros são opcionais e se combinam, como na home. */
    @GetMapping
    public List<EventoResponse> listar(@RequestParam(required = false) String estado,
                                       @RequestParam(required = false) String q,
                                       @RequestParam(required = false) String categoria) {
        return eventoService.listar(estado, q, categoria);
    }

    @GetMapping("/{id}")
    public EventoResponse detalhar(@PathVariable Long id) {
        return eventoService.detalhar(id);
    }
}
