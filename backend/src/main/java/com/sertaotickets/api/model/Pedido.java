package com.sertaotickets.api.model;

import com.sertaotickets.api.model.enums.StatusPedido;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Carrinho fechado, aguardando ou já tendo recebido o PIX.
 *
 * <p>Um pedido é sempre de um único evento — é assim que o checkout do front
 * funciona, e é o que permite aplicar o limite de ingressos por CPF por evento.
 *
 * <p>O {@code codigo} é o identificador público (o {@code id} nunca sai na API),
 * para não expor a sequência do banco nem permitir varrer pedidos alheios.
 */
@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(name = "nome_comprador", nullable = false)
    private String nomeComprador;

    /** Sempre normalizado: só os 11 dígitos, sem pontos nem traço. */
    @Column(name = "cpf_comprador", nullable = false, length = 11)
    private String cpfComprador;

    @Column(nullable = false, length = 20)
    private String whatsapp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatusPedido status = StatusPedido.PENDENTE;

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    /** Fim da janela de pagamento. Casa com o contador de 10 min do checkout. */
    @Column(name = "expira_em", nullable = false)
    private LocalDateTime expiraEm;

    @Column(name = "pago_em")
    private LocalDateTime pagoEm;

    @Column(name = "pix_copia_e_cola", length = 1000)
    private String pixCopiaECola;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    @Builder.Default
    private List<ItemPedido> itens = new ArrayList<>();

    public void adicionarItem(ItemPedido item) {
        item.setPedido(this);
        this.itens.add(item);
    }

    public boolean estaExpirado(LocalDateTime agora) {
        return status == StatusPedido.PENDENTE && agora.isAfter(expiraEm);
    }

    /** Total de ingressos do pedido, somando as quantidades de todos os itens. */
    public int quantidadeTotalIngressos() {
        return itens.stream().mapToInt(ItemPedido::getQuantidade).sum();
    }
}
