package com.sertaotickets.api.repository;

import com.sertaotickets.api.model.Ingresso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngressoRepository extends JpaRepository<Ingresso, Long> {

    /** O CPF chega sempre normalizado (só os 11 dígitos). */
    List<Ingresso> findByCpfTitularOrderByEmitidoEmDesc(String cpfTitular);

    List<Ingresso> findByPedidoCodigoOrderByIdAsc(String codigo);

    boolean existsByPedidoCodigo(String codigo);

    boolean existsByCodigo(String codigo);
}
