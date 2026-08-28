package com.sertaotickets.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Faixa de preço e estoque de um {@link Setor}. É a unidade real de venda.
 *
 * <p>{@code quantidadeVendida} conta tanto o que já foi pago quanto o que está
 * reservado por pedido pendente. A reserva é desfeita quando o pedido expira,
 * então o número nunca superestima o disponível.
 *
 * <p>O {@code @Version} protege contra venda dupla: se dois checkouts baixarem o
 * mesmo lote ao mesmo tempo, o segundo falha com lock otimista em vez de deixar
 * o estoque negativo.
 */
@Entity
@Table(name = "lotes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "setor_id", nullable = false)
    private Setor setor;

    /** 1º lote, 2º lote... É o que o front mostra como "Nº Lote". */
    @Column(nullable = false)
    private int numero;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "quantidade_total", nullable = false)
    private int quantidadeTotal;

    @Column(name = "quantidade_vendida", nullable = false)
    private int quantidadeVendida;

    @Column(nullable = false)
    @Builder.Default
    private boolean ativo = true;

    @Version
    private Long version;

    public int getQuantidadeRestante() {
        return Math.max(0, quantidadeTotal - quantidadeVendida);
    }

    public boolean isEsgotado() {
        return getQuantidadeRestante() == 0;
    }

    public boolean comportaVenda(int quantidade) {
        return ativo && quantidade > 0 && getQuantidadeRestante() >= quantidade;
    }

    public void reservar(int quantidade) {
        this.quantidadeVendida += quantidade;
    }

    public void devolver(int quantidade) {
        this.quantidadeVendida = Math.max(0, this.quantidadeVendida - quantidade);
    }
}
