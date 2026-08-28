package com.sertaotickets.api.repository;

import com.sertaotickets.api.model.Evento;
import com.sertaotickets.api.model.enums.CategoriaEvento;
import com.sertaotickets.api.model.enums.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    /**
     * Filtro do catálogo. Parâmetro nulo significa "não filtra por isso".
     *
     * <p>A busca textual livre não entra aqui: ela precisa varrer também as atrações
     * (@ElementCollection) e ficaria com join duplicado. Como o catálogo é pequeno,
     * o serviço aplica esse filtro em memória.
     */
    @Query("""
            select distinct e from Evento e
            where (:estado is null or e.estado = :estado)
              and (:categoria is null or :categoria member of e.categorias)
            order by e.dataInicio asc
            """)
    List<Evento> buscar(@Param("estado") Estado estado,
                        @Param("categoria") CategoriaEvento categoria);
}
