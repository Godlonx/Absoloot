package com.cours.atelier_partique.infrastructure.adapters.in.web;

import com.cours.atelier_partique.application.ports.in.AdventurerCompetenceUseCase;
import com.cours.atelier_partique.infrastructure.web.openapi.api.AventurersCompetencesApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencesDisponiblesResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AdventurerCompetenceController implements AventurersCompetencesApi {

    private final AdventurerCompetenceUseCase adventurerCompetenceUseCase;

    @Override
    public CompetenceDto addCompetenceToAdventurer(UUID id, UUID competenceId) {
        return adventurerCompetenceUseCase.add(id, competenceId);
    }

    @Override
    public List<CompetenceDto> listAdventurerCompetences(UUID id) {
        return adventurerCompetenceUseCase.list(id);
    }

    @Override
    public CompetencesDisponiblesResponse listCompetencesDisponibles(UUID id) {
        return adventurerCompetenceUseCase.listDisponibles(id);
    }

    @Override
    public void removeCompetenceFromAdventurer(UUID id, UUID competenceId) {
        adventurerCompetenceUseCase.remove(id, competenceId);
    }
}
