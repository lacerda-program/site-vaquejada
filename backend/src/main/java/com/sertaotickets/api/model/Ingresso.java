package com.sertaotickets.api.model;

import com.sertaotickets.api.model.enums.StatusIngresso;
import com.sertaotickets.api.model.enums.TipoIngresso;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Ingresso emitido, um por assento vendido.
 *
 * <p>Os campos {@code evento*} e {@code setorNome} são <b>cópias</b> do que valia
 * no momento da emissão, não projeções da entidade viva. Se o organizador renomear
 * o setor ou mudar a data depois, o ingresso na carteira do cliente continua dizendo
 * o que ele comprou. É por isso que existe redundância aparente aqui.
 */
@Entity
@Table(name = "ingressos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingresso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Código impresso no ingresso, no formato ST-123456. */
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    /** Sempre normalizado: só os 11 dígitos. */
    @Column(name = "cpf_titular", nullable = false, length = 11)
    private String cpfTitular;

    @Column(name = "nome_titular", nullable = false)
    private String nomeTitular;

    @Column(name = "qr_code_data", nullable = false, length = 200)
    private String qrCodeData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatusIngresso status = StatusIngresso.VALIDO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TipoIngresso tipo = TipoIngresso.ESPECTADOR;

    @Column(name = "preco_pago", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoPago;

    @Column(name = "emitido_em", nullable = false)
    private LocalDateTime emitidoEm;

    // --- Retrato do que foi comprado (não sincroniza com o evento depois) ---

    @Column(name = "setor_nome", nullable = false)
    private String setorNome;

    @Column(name = "lote_numero", nullable = false)
    private int loteNumero;

    @Column(name = "evento_titulo", nullable = false)
    private String eventoTitulo;

    @Column(name = "evento_parque", nullable = false)
    private String eventoParque;

    /** Já no formato "Cidade/UF", como a carteira exibe. */
    @Column(name = "evento_cidade_uf", nullable = false, length = 120)
    private String eventoCidadeUf;

    /** Ex.: "10 a 13 de Setembro de 2026". */
    @Column(name = "evento_periodo", nullable = false, length = 120)
    private String eventoPeriodo;

    // --- Só preenchido quando tipo = COMPETIDOR ---

    @Column(name = "vaqueiro_nome")
    private String vaqueiroNome;

    @Column(name = "cavalo_nome")
    private String cavaloNome;

    @Column(name = "esteira_nome")
    private String esteiraNome;

    /** Número da senha de corrida sorteada para o vaqueiro. */
    @Column(name = "senha_numero")
    private Integer senhaNumero;
}
