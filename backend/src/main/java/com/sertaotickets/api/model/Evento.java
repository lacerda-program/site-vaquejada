package com.sertaotickets.api.model;

import com.sertaotickets.api.model.enums.CategoriaEvento;
import com.sertaotickets.api.model.enums.Estado;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Uma vaquejada em cartaz.
 *
 * <p>O preço não mora aqui: cada {@link Setor} tem seus {@link Lote}s, e é do lote
 * vigente que saem preço e disponibilidade. O "a partir de" exibido na home é
 * derivado em tempo de leitura, nunca persistido, para não dessincronizar quando
 * um lote vira.
 */
@Entity
@Table(name = "eventos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String parque;

    @Column(nullable = false)
    private String cidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 2)
    private Estado estado;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(length = 2000)
    private String descricao;

    @Column(name = "imagem_url", length = 500)
    private String imagemUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    /** Chancela ABVA: regulamento unificado e bem-estar animal. */
    @Column(name = "certificado_abva", nullable = false)
    private boolean certificadoAbva;

    /** Chancela ABQM: registro genealógico do quarto de milha. */
    @Column(name = "certificado_abqm", nullable = false)
    private boolean certificadoAbqm;

    @Column(nullable = false)
    private boolean destaque;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "evento_atracoes", joinColumns = @JoinColumn(name = "evento_id"))
    @Column(name = "atracao")
    @Builder.Default
    private List<String> atracoes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "evento_categorias", joinColumns = @JoinColumn(name = "evento_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", length = 30)
    @Builder.Default
    private Set<CategoriaEvento> categorias = new LinkedHashSet<>();

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @Builder.Default
    private List<Setor> setores = new ArrayList<>();

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @Builder.Default
    private List<CategoriaCompetidor> categoriasCompetidor = new ArrayList<>();

    /** Mantém os dois lados da relação em sincronia. */
    public void adicionarSetor(Setor setor) {
        setor.setEvento(this);
        this.setores.add(setor);
    }

    public void adicionarCategoriaCompetidor(CategoriaCompetidor categoria) {
        categoria.setEvento(this);
        this.categoriasCompetidor.add(categoria);
    }
}
