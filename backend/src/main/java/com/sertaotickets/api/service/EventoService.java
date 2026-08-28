package com.sertaotickets.api.service;

import com.sertaotickets.api.dto.CategoriaCompetidorResponse;
import com.sertaotickets.api.dto.EventoResponse;
import com.sertaotickets.api.exception.RecursoNaoEncontradoException;
import com.sertaotickets.api.model.CategoriaCompetidor;
import com.sertaotickets.api.model.Evento;
import com.sertaotickets.api.model.enums.CategoriaEvento;
import com.sertaotickets.api.model.enums.Estado;
import com.sertaotickets.api.repository.EventoRepository;
import com.sertaotickets.api.util.DataBrasileira;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

/**
 * Catálogo público de eventos.
 *
 * <p>Com {@code open-in-view=false}, o mapeamento para DTO acontece dentro da
 * transação — é aqui que as coleções lazy (setores, lotes, atrações) são tocadas.
 */
@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;
    private final LoteService loteService;

    /**
     * @param estado    UF de duas letras; nulo ou vazio traz todos
     * @param q         busca livre em título, parque, cidade e atrações
     * @param categoria nome da constante ou o rótulo exibido ("Grandes Circuitos")
     */
    @Transactional(readOnly = true)
    public List<EventoResponse> listar(String estado, String q, String categoria) {
        Estado uf = converterEstado(estado);
        CategoriaEvento cat = CategoriaEvento.deTexto(categoria).orElse(null);

        return eventoRepository.buscar(uf, cat).stream()
                .filter(evento -> combinaComBusca(evento, q))
                .map(this::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventoResponse detalhar(Long id) {
        return eventoRepository.findById(id)
                .map(this::paraResponse)
                .orElseThrow(() -> RecursoNaoEncontradoException.evento(id));
    }

    /** Para uso interno de outros serviços, que precisam da entidade e não do DTO. */
    public Evento buscarEntidade(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.evento(id));
    }

    public EventoResponse paraResponse(Evento evento) {
        return new EventoResponse(
                String.valueOf(evento.getId()),
                evento.getTitulo(),
                evento.getParque(),
                evento.getCidade(),
                evento.getEstado().name(),
                DataBrasileira.curta(evento.getDataInicio()),
                DataBrasileira.curta(evento.getDataFim()),
                DataBrasileira.periodo(evento.getDataInicio(), evento.getDataFim()),
                evento.getImagemUrl(),
                evento.getBannerUrl(),
                List.copyOf(evento.getAtracoes()),
                loteService.precoInicial(evento),
                evento.getSetores().stream().map(loteService::paraResponse).toList(),
                evento.getCategoriasCompetidor().stream().map(this::paraResponse).toList(),
                evento.getCategorias().stream().map(CategoriaEvento::getRotulo).toList(),
                evento.isCertificadoAbva(),
                evento.isCertificadoAbqm(),
                evento.getDescricao());
    }

    private CategoriaCompetidorResponse paraResponse(CategoriaCompetidor categoria) {
        return new CategoriaCompetidorResponse(
                String.valueOf(categoria.getId()),
                categoria.getNivel().getRotulo(),
                categoria.getPreco(),
                categoria.getVagasTotais(),
                categoria.getVagasPreenchidas());
    }

    private Estado converterEstado(String sigla) {
        if (sigla == null || sigla.isBlank()) {
            return null;
        }
        try {
            return Estado.valueOf(sigla.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            // UF que não atendemos: devolve lista vazia em vez de 400, porque
            // isso vem de filtro de tela, não de erro do desenvolvedor.
            return null;
        }
    }

    /** Mesmo alcance do filtro do HomeView: título, parque, cidade e atrações. */
    private boolean combinaComBusca(Evento evento, String q) {
        if (q == null || q.isBlank()) {
            return true;
        }
        String termo = semAcento(q);
        return semAcento(evento.getTitulo()).contains(termo)
                || semAcento(evento.getParque()).contains(termo)
                || semAcento(evento.getCidade()).contains(termo)
                || evento.getAtracoes().stream().anyMatch(a -> semAcento(a).contains(termo));
    }

    /** "Serrinha" acha "serrinha", e "vaquejada" acha "Vaquejada". */
    private String semAcento(String texto) {
        if (texto == null) {
            return "";
        }
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }
}
