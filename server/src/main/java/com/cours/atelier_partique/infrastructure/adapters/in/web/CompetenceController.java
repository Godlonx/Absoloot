package com.cours.atelier_partique.infrastructure.adapters.in.web;

import com.cours.atelier_partique.application.ports.in.CompetenceUseCase;
import com.cours.atelier_partique.infrastructure.web.openapi.api.CompetencesApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AventuriersLiesResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencePayload;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.ListCompetences200Response;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CompetenceController implements CompetencesApi {

    private final CompetenceUseCase competenceUseCase;

    @Override
    public CompetenceDto createCompetence(CompetencePayload competencePayload) {
        return competenceUseCase.create(competencePayload);
    }

    @Override
    public void deleteCompetence(UUID id) {
        competenceUseCase.delete(id);
    }

    @Override
    public CompetenceDto getCompetence(UUID id) {
        return competenceUseCase.get(id);
    }

    @Override
    public AventuriersLiesResponse listAventurersLinkedToCompetence(UUID id) {
        return competenceUseCase.listAventurersLinked(id);
    }

    @Override
    public ListCompetences200Response listCompetences(Integer page, Integer size) {
        return competenceUseCase.list(page == null ? 0 : page, size == null ? 20 : size);
    }

    @Override
    public CompetenceDto updateCompetence(UUID id, CompetencePayload competencePayload) {
        return competenceUseCase.update(id, competencePayload);
    }
}
