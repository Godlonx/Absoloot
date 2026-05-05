package com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa;

import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaAdventurerRepository extends JpaRepository<AdventurerEntity, UUID> {
}
