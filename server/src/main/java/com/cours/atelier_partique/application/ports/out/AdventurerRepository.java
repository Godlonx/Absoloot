package com.cours.atelier_partique.application.ports.out;

import com.cours.atelier_partique.domain.model.AdventurerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdventurerRepository extends JpaRepository<AdventurerEntity, UUID> {

    Optional<AdventurerEntity> findByNameIgnoreCase(String name);
}
