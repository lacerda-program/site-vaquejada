package com.sertaotickets.api.repository;

import com.sertaotickets.api.model.Setor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SetorRepository extends JpaRepository<Setor, Long> {

    List<Setor> findByEventoId(Long eventoId);

    /**
     * Busca amarrada ao evento: impede que o cliente monte um pedido misturando
     * setor de um evento com o id de outro.
     */
    Optional<Setor> findByIdAndEventoId(Long id, Long eventoId);
}
