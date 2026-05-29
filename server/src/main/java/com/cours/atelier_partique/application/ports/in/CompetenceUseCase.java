package com.cours.atelier_partique.application.ports.in;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.AventuriersLiesResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencePayload;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.ListCompetences200Response;

import java.util.UUID;

public interface CompetenceUseCase {
    ListCompetences200Response list(int page, int size);

    CompetenceDto get(UUID id);

    CompetenceDto create(CompetencePayload payload);

    CompetenceDto update(UUID id, CompetencePayload payload);

    void delete(UUID id);

    AventuriersLiesResponse listAventurersLinked(UUID competenceId);
}
