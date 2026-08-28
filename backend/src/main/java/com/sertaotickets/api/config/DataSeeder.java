package com.sertaotickets.api.config;

import com.sertaotickets.api.model.CategoriaCompetidor;
import com.sertaotickets.api.model.Evento;
import com.sertaotickets.api.model.Lote;
import com.sertaotickets.api.model.Setor;
import com.sertaotickets.api.model.enums.CategoriaEvento;
import com.sertaotickets.api.model.enums.Estado;
import com.sertaotickets.api.model.enums.NivelCompetidor;
import com.sertaotickets.api.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Popula o H2 com os mesmos 6 eventos de {@code frontend/src/data/events.ts}.
 *
 * <p>Os lotes não são inventados: cada um foi calibrado para que o preço, o número
 * do lote, o {@code batchStatus} e o {@code ticketsLeft} <b>derivados</b> pelo
 * {@code LoteService} batam com o que o mock exibe hoje. Assim a troca do mock
 * pela API não muda um pixel da tela.
 *
 * <p>Os eventos são gravados na ordem do mock de propósito, para que os ids
 * gerados (1..6) coincidam com os do front.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final EventoRepository eventoRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (eventoRepository.count() > 0) {
            return;
        }
        eventoRepository.saveAll(List.of(
                parqueDasPalmeiras(),
                serrinha(),
                arthurFilho(),
                ruffinaBorba(),
                campinaGrande(),
                arapua()));

        log.info("Catálogo inicial gravado: {} evento(s).", eventoRepository.count());
    }

    private Evento parqueDasPalmeiras() {
        Evento evento = Evento.builder()
                .titulo("Vaquejada do Parque das Palmeiras - Edição Ouro")
                .parque("Parque das Palmeiras")
                .cidade("Lagarto")
                .estado(Estado.SE)
                .dataInicio(LocalDate.of(2026, 9, 10))
                .dataFim(LocalDate.of(2026, 9, 13))
                .imagemUrl("https://images.unsplash.com/photo-1598974357801-cbca100e6583?auto=format&fit=crop&q=80&w=600")
                .bannerUrl("https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1200")
                .atracoes(atracoes("Wesley Safadão", "João Gomes", "Tarcísio do Acordeon", "Rey Vaqueiro"))
                .categorias(categorias(CategoriaEvento.GRANDES_CIRCUITOS, CategoriaEvento.VAQUEJADAS_DO_MES))
                .certificadoAbva(true)
                .certificadoAbqm(true)
                .destaque(true)
                .descricao("A maior estrutura de Vaquejada da América Latina convida você para 4 dias de muita "
                        + "derrubada de boi, competições de alto nível e shows inesquecíveis. Homologado pelas "
                        + "chancelas ABVA e ABQM, garantindo bem-estar animal e segurança para competidores e público.")
                .build();

        evento.adicionarSetor(setor("Pista (Arena)",
                "Acesso à arena principal, banheiros dedicados e praça de alimentação com vista frontal do palco.",
                false, lote(1, "60.00", 800, 800), lote(2, "80.00", 1500, 900)));

        evento.adicionarSetor(setor("Área VIP Premium",
                "Vista privilegiada da pista de julgamento e do palco de shows, bares exclusivos e banheiros climatizados.",
                false, lote(1, "110.00", 300, 300), lote(2, "130.00", 300, 300), lote(3, "150.00", 250, 238)));

        evento.adicionarSetor(setor("Lounge Camarote Palmeiras",
                "Serviço de buffet regional incluso, open bar premium, visão panorâmica em altura elevada e conforto absoluto.",
                false, lote(1, "280.00", 120, 120), lote(2, "350.00", 100, 94)));

        // Exclusivo de competidor: fica fora do "a partir de", senão o evento
        // anunciaria R$ 50 num ingresso que o público geral não pode comprar.
        evento.adicionarSetor(setor("Acesso Baia Competidor",
                "Exclusivo para tratadores e competidores. Acesso à área de cocheiras e preparação dos animais.",
                true, lote(1, "50.00", 400, 100)));

        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.INICIANTE, "150.00", 32));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.ASPIRANTE, "300.00", 47));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.PROFISSIONAL, "600.00", 40));
        return evento;
    }

    private Evento serrinha() {
        Evento evento = Evento.builder()
                .titulo("79ª Vaquejada de Serrinha")
                .parque("Parque Maria do Carmo")
                .cidade("Serrinha")
                .estado(Estado.BA)
                .dataInicio(LocalDate.of(2026, 9, 3))
                .dataFim(LocalDate.of(2026, 9, 6))
                .imagemUrl("https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=600")
                .bannerUrl("https://images.unsplash.com/photo-1598974357801-cbca100e6583?auto=format&fit=crop&q=80&w=1200")
                .atracoes(atracoes("Nattan", "Xand Avião", "Mari Fernandez", "Iguinho & Lulinha"))
                .categorias(categorias(CategoriaEvento.GRANDES_CIRCUITOS, CategoriaEvento.VAQUEJADAS_DO_MES))
                .certificadoAbva(true)
                .certificadoAbqm(true)
                .destaque(true)
                .descricao("A vaquejada mais charmosa e tradicional do Brasil chega à sua histórica 79ª edição. "
                        + "Viva a emoção da festa de Serrinha no Parque Maria do Carmo, onde a cultura sertaneja "
                        + "vibra mais forte nas arquibancadas e na poeira da pista.")
                .build();

        evento.adicionarSetor(setor("Pista (Arena)",
                "Espaço amplo próximo ao palco e à faixa de pontuação.",
                false, lote(1, "70.00", 2000, 700)));

        evento.adicionarSetor(setor("Área VIP Maria do Carmo",
                "Entrada exclusiva, bares temáticos e área frontal ao grande palco de shows.",
                false, lote(1, "100.00", 400, 400), lote(2, "130.00", 500, 200)));

        evento.adicionarSetor(setor("Camarote Vip Serrinha",
                "Área coberta superior, banheiros VIPs e vista exclusiva do circuito de derrubada.",
                false, lote(1, "200.00", 150, 150), lote(2, "240.00", 150, 150), lote(3, "280.00", 120, 112)));

        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.INICIANTE, "140.00", 28));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.ASPIRANTE, "280.00", 35));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.PROFISSIONAL, "550.00", 48));
        return evento;
    }

    private Evento arthurFilho() {
        Evento evento = Evento.builder()
                .titulo("Vaquejada do Parque Arthur Filho")
                .parque("Parque Arthur Filho")
                .cidade("Pilar")
                .estado(Estado.AL)
                .dataInicio(LocalDate.of(2026, 9, 24))
                .dataFim(LocalDate.of(2026, 9, 27))
                .imagemUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600")
                .bannerUrl("https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200")
                .atracoes(atracoes("Henry Freitas", "Zé Vaqueiro", "Luan Estilizado", "Seu Desejo"))
                .categorias(categorias(CategoriaEvento.PROXIMOS_EVENTOS))
                .certificadoAbva(true)
                .certificadoAbqm(true)
                .destaque(false)
                .descricao("Pilar acolhe o melhor da vaquejada alagoana. O Parque Arthur Filho abre suas porteiras "
                        + "para receber a vaqueirama de todo o país para disputas acirradas e uma programação de "
                        + "shows com grandes nomes da pisadinha e do forró.")
                .build();

        evento.adicionarSetor(setor("Pista",
                "Acesso padrão à área de eventos e arquibancadas de cimento.",
                false, lote(1, "60.00", 1500, 400)));

        evento.adicionarSetor(setor("Camarote Arthur Filho",
                "Acesso VIP elevado com visão total da pista e do palco principal.",
                false, lote(1, "110.00", 200, 200), lote(2, "140.00", 250, 231)));

        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.INICIANTE, "120.00", 15));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.ASPIRANTE, "250.00", 18));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.PROFISSIONAL, "500.00", 29));
        return evento;
    }

    private Evento ruffinaBorba() {
        Evento evento = Evento.builder()
                .titulo("Grande Vaquejada do Parque Ruffina Borba")
                .parque("Parque Ruffina Borba")
                .cidade("Bezerros")
                .estado(Estado.PE)
                .dataInicio(LocalDate.of(2026, 10, 8))
                .dataFim(LocalDate.of(2026, 10, 11))
                .imagemUrl("https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600")
                .bannerUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200")
                .atracoes(atracoes("Tarcísio do Acordeon", "Mano Walter", "Limão com Mel", "Heitor Costa"))
                .categorias(categorias(CategoriaEvento.PROXIMOS_EVENTOS, CategoriaEvento.VAQUEJADAS_DO_MES))
                .certificadoAbva(true)
                .certificadoAbqm(false)
                .destaque(false)
                .descricao("Bezerros recebe a vaqueirama na lendária pista do Ruffina Borba. Conhecida pela pista "
                        + "técnica e pela recepção calorosa da torcida pernambucana, o evento reúne esporte equestre "
                        + "de ponta e shows de forró até o amanhecer.")
                .build();

        evento.adicionarSetor(setor("Arena Principal",
                "Acesso ao setor geral de arena, bares e praça de alimentação.",
                false, lote(1, "65.00", 1800, 500)));

        evento.adicionarSetor(setor("Frontstage Premium",
                "Acesso à frente do palco principal de shows e lounges de convivência.",
                false, lote(1, "95.00", 300, 300), lote(2, "120.00", 400, 150)));

        evento.adicionarSetor(setor("Camarote Ruffina VIP",
                "Vista privilegiada da porteira de saída, buffet regional leve e banheiros exclusivos.",
                false, lote(1, "250.00", 80, 76)));

        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.INICIANTE, "130.00", 22));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.ASPIRANTE, "270.00", 29));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.PROFISSIONAL, "550.00", 43));
        return evento;
    }

    private Evento campinaGrande() {
        Evento evento = Evento.builder()
                .titulo("Vaquejada Tradicional de Campina Grande")
                .parque("Parque Ivandro Cunha Lima")
                .cidade("Campina Grande")
                .estado(Estado.PB)
                .dataInicio(LocalDate.of(2026, 10, 15))
                .dataFim(LocalDate.of(2026, 10, 18))
                .imagemUrl("https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600")
                .bannerUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200")
                .atracoes(atracoes("Felipe Amorim", "Zé Cantor", "Luan Estilizado", "Bonde do Brasil"))
                .categorias(categorias(CategoriaEvento.GRANDES_CIRCUITOS))
                .certificadoAbva(true)
                .certificadoAbqm(true)
                .destaque(false)
                .descricao("Campina Grande sedia uma das festas mais consagradas do estado. O Parque Ivandro Cunha "
                        + "Lima traz um festival de derrubadas de bois e grandes shows musicais de forró estilizado "
                        + "que marcam época no coração da Paraíba.")
                .build();

        evento.adicionarSetor(setor("Pista Simples",
                "Acesso à área geral de shows e arquibancadas populares.",
                false, lote(1, "50.00", 1200, 300)));

        evento.adicionarSetor(setor("VIP Ivandro Cunha Lima",
                "Localização frontal ao palco, entrada separada e serviços de bar adicionais.",
                false, lote(1, "85.00", 350, 350), lote(2, "110.00", 450, 180)));

        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.INICIANTE, "110.00", 10));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.ASPIRANTE, "220.00", 12));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.PROFISSIONAL, "450.00", 20));
        return evento;
    }

    private Evento arapua() {
        Evento evento = Evento.builder()
                .titulo("Vaquejada da Saudade de Santo Antônio")
                .parque("Parque Arapuá")
                .cidade("Santo Antônio")
                .estado(Estado.RN)
                .dataInicio(LocalDate.of(2026, 10, 29))
                .dataFim(LocalDate.of(2026, 11, 1))
                .imagemUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600")
                .bannerUrl("https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200")
                .atracoes(atracoes("Zezo Potiguar", "Raí Saia Rodada", "Luan Estilizado", "Grafith"))
                .categorias(categorias(CategoriaEvento.PROXIMOS_EVENTOS))
                .certificadoAbva(false)
                .certificadoAbqm(true)
                .destaque(false)
                .descricao("A famosa Vaquejada da Saudade atrai milhares de potiguares ao Parque Arapuá. Um encontro "
                        + "clássico do forró das antigas e das competições esportivas que resgatam as raízes do homem "
                        + "do campo norte-rio-grandense.")
                .build();

        evento.adicionarSetor(setor("Pista Geral",
                "Acesso às áreas comuns do parque e palco de shows.",
                false, lote(1, "55.00", 1000, 250)));

        evento.adicionarSetor(setor("Lounge Arapuá Club",
                "Ambiente climatizado com bar privativo, DJs nos intervalos e visão frontal da faixa de pontuação.",
                false, lote(1, "160.00", 150, 150), lote(2, "200.00", 180, 165)));

        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.INICIANTE, "100.00", 8));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.ASPIRANTE, "200.00", 10));
        evento.adicionarCategoriaCompetidor(competidor(NivelCompetidor.PROFISSIONAL, "400.00", 16));
        return evento;
    }

    // --- montagem ---

    private Setor setor(String nome, String descricao, boolean exclusivoCompetidor, Lote... lotes) {
        Setor setor = Setor.builder()
                .nome(nome)
                .descricao(descricao)
                .exclusivoCompetidor(exclusivoCompetidor)
                .build();
        for (Lote lote : lotes) {
            setor.adicionarLote(lote);
        }
        return setor;
    }

    /** Lote já esgotado é aquele com {@code vendida == total} — o lote seguinte assume. */
    private Lote lote(int numero, String preco, int total, int vendida) {
        return Lote.builder()
                .numero(numero)
                .preco(new BigDecimal(preco))
                .quantidadeTotal(total)
                .quantidadeVendida(vendida)
                .ativo(true)
                .build();
    }

    private CategoriaCompetidor competidor(NivelCompetidor nivel, String preco, int preenchidas) {
        return CategoriaCompetidor.builder()
                .nivel(nivel)
                .preco(new BigDecimal(preco))
                .vagasTotais(50)
                .vagasPreenchidas(preenchidas)
                .build();
    }

    private Set<CategoriaEvento> categorias(CategoriaEvento... valores) {
        return new LinkedHashSet<>(List.of(valores));
    }

    /** Coleções mutáveis: o Hibernate precisa poder envolvê-las na entidade gerenciada. */
    private List<String> atracoes(String... valores) {
        return new ArrayList<>(List.of(valores));
    }
}
