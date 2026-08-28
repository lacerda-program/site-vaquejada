package com.sertaotickets.api.model;

import com.sertaotickets.api.model.enums.NivelCompetidor;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Senhas de disputa por nível. Cada evento abre 50 vagas por nível.
 *
 * <p>Hoje é só exposto na leitura do evento — a inscrição do vaqueiro
 * (vaqueiro, cavalo, esteira, senha) ainda não tem endpoint.
 */
@Entity
@Table(name = "categorias_competidor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaCompetidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NivelCompetidor nivel;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "vagas_totais", nullable = false)
    @Builder.Default
    private int vagasTotais = 50;

    @Column(name = "vagas_preenchidas", nullable = false)
    private int vagasPreenchidas;

    public int getVagasRestantes() {
        return Math.max(0, vagasTotais - vagasPreenchidas);
    }
}
