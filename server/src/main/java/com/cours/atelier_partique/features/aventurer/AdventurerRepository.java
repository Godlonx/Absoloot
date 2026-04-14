package com.cours.atelier_partique.features.aventurer;

import com.cours.atelier_partique.infrastructure.database.models.AdventurerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface AdventurerRepository extends JpaRepository<AdventurerEntity, UUID> {

    /** JPA Query Methods */
    Optional<AdventurerEntity> findByNameIgnoreCase(String name);

    /** JPA Query Methods */
    Page<AdventurerEntity> findByAdvClass(AdvClassEnum advClass, Pageable pageable);

    /** Utilisation du JPQL, la requête utilise
     * les entités et non le SQL classique*/
    @Query("""
            select a
            from AdventurerEntity a
            where a.level >= :min
            order by a.level desc
            """)
    Page<AdventurerEntity> findTopByNiveau(@Param("min") int min, Pageable pageable);
}