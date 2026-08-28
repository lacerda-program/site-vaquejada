package com.sertaotickets.api.repository;

import com.sertaotickets.api.model.Pedido;
import com.sertaotickets.api.model.enums.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    /** Pendentes que estouraram a janela de pagamento, para devolver o estoque. */
    List<Pedido> findByStatusAndExpiraEmBefore(StatusPedido status, LocalDateTime limite);

    /**
     * Quantos ingressos esse CPF já segura nesse evento — somando os pagos e os
     * pendentes ainda dentro do prazo. Pendente vencido não conta: o estoque dele
     * volta para a praça.
     */
    @Query("""
            select coalesce(sum(i.quantidade), 0)
            from ItemPedido i
            join i.pedido p
            where p.evento.id = :eventoId
              and p.cpfComprador = :cpf
              and (p.status = :pago or (p.status = :pendente and p.expiraEm > :agora))
            """)
    int somarIngressosDoCpfNoEvento(@Param("eventoId") Long eventoId,
                                    @Param("cpf") String cpf,
                                    @Param("pago") StatusPedido pago,
                                    @Param("pendente") StatusPedido pendente,
                                    @Param("agora") LocalDateTime agora);
}
