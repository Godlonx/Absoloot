package com.cours.atelier_partique.application.ports.in;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencesDisponiblesResponse;

import java.util.List;
import java.util.UUID;

public interface AdventurerCompetenceUseCase {
    List<CompetenceDto> list(UUID adventurerId);

    CompetenceDto add(UUID adventurerId, UUID competenceId);

    void remove(UUID adventurerId, UUID competenceId);

    CompetencesDisponiblesResponse listDisponibles(UUID adventurerId);
}
