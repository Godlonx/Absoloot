package com.cours.atelier_partique.application.ports.out;

import com.cours.atelier_partique.domain.model.Adventurer;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdventurerRepository {

    Adventurer save(Adventurer adventurer);

    List<Adventurer> findAll();
}
