package com.cours.atelier_partique.application.ports.out;

import com.cours.atelier_partique.domain.model.CompetenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompetenceRepository extends JpaRepository<CompetenceEntity, UUID> {

    Optional<CompetenceEntity> findByNomIgnoreCase(String nom);

    /** Compétences qui listent la compétence donnée parmi leurs prérequis. */
    List<CompetenceEntity> findByCompetencesRequises_Id(UUID id);
}
