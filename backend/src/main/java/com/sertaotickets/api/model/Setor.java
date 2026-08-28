package com.sertaotickets.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * Área de venda dentro do parque (Pista, Área VIP, Camarote, Baia...).
 *
 * <p>O setor em si não tem preço — ele é uma sequência de {@link Lote}s.
 */
@Entity
@Table(name = "setores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Setor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(nullable = false)
    private String nome;

    @Column(length = 500)
    private String descricao;

    /**
     * Setor restrito a vaqueiros e tratadores (ex.: acesso às baias).
     * Fica de fora do cálculo do "a partir de", que é uma vitrine para o público geral.
     */
    @Column(name = "exclusivo_competidor", nullable = false)
    private boolean exclusivoCompetidor;

    @OneToMany(mappedBy = "setor", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("numero ASC")
    @Builder.Default
    private List<Lote> lotes = new ArrayList<>();

    public void adicionarLote(Lote lote) {
        lote.setSetor(this);
        this.lotes.add(lote);
    }

    /**
     * Lote em venda agora: o de menor número que ainda esteja ativo e com estoque.
     * Vazio quando o setor inteiro esgotou.
     */
    public Optional<Lote> loteVigente() {
        return lotes.stream()
                .filter(Lote::isAtivo)
                .filter(lote -> !lote.isEsgotado())
                .min(Comparator.comparingInt(Lote::getNumero));
    }

    /**
     * Último lote da fila, usado para exibir preço e número quando tudo já esgotou —
     * assim o card não fica sem preço na tela.
     */
    public Optional<Lote> ultimoLote() {
        return lotes.stream().max(Comparator.comparingInt(Lote::getNumero));
    }
}
