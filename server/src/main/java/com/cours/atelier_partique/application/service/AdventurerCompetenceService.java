package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.in.AdventurerCompetenceUseCase;
import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.application.ports.out.CompetenceRepository;
import com.cours.atelier_partique.domain.exeption.ConflictException;
import com.cours.atelier_partique.domain.exeption.NotFoundException;
import com.cours.atelier_partique.domain.exeption.PrerequisNonSatisfaitException;
import com.cours.atelier_partique.domain.model.AdventurerEntity;
import com.cours.atelier_partique.domain.model.CompetenceEntity;
import com.cours.atelier_partique.domain.service.CompetenceDomain;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.CompetenceMapper;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceReference;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencesDisponiblesResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencesDisponiblesResponseBloqueesInner;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencesDisponiblesResponseBloqueesInnerPrerequisManquantsInner;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdventurerCompetenceService implements AdventurerCompetenceUseCase {

    private final AdventurerRepository adventurerRepository;
    private final CompetenceRepository competenceRepository;
    private final CompetenceDomain competenceDomain;
    private final CompetenceMapper competenceMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CompetenceDto> list(UUID adventurerId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);
        return adventurer.getCompetences().stream()
                .map(competenceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CompetenceDto add(UUID adventurerId, UUID competenceId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);
        CompetenceEntity competence = findCompetence(competenceId);

        Set<UUID> ownedIds = ownedIds(adventurer);
        if (ownedIds.contains(competenceId)) {
            throw new ConflictException("L'aventurier possède déjà cette compétence");
        }

        competenceDomain.firstMissingPrerequis(adventurer, competence, ownedIds)
                .ifPresent(missing -> {
                    throw new PrerequisNonSatisfaitException(
                            "Les prérequis ne sont pas satisfaits", missing.type(), missing.detail());
                });

        adventurer.getCompetences().add(competence);
        adventurerRepository.save(adventurer);
        return competenceMapper.toDto(competence);
    }

    @Override
    @Transactional
    public void remove(UUID adventurerId, UUID competenceId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);

        boolean owns = adventurer.getCompetences().stream()
                .anyMatch(c -> c.getId().equals(competenceId));
        if (!owns) {
            throw new NotFoundException("L'aventurier ne possède pas cette compétence");
        }

        // Règle 3 : bloquer si une autre compétence possédée dépend de celle-ci.
        List<String> dependents = competenceDomain.findDependentCompetences(
                competenceId, adventurer.getCompetences());
        if (!dependents.isEmpty()) {
            throw new ConflictException(
                    "Impossible de retirer cette compétence",
                    "Cette compétence est un prérequis de " + String.join(", ", dependents));
        }

        adventurer.getCompetences().removeIf(c -> c.getId().equals(competenceId));
        adventurerRepository.save(adventurer);
    }

    @Override
    @Transactional(readOnly = true)
    public CompetencesDisponiblesResponse listDisponibles(UUID adventurerId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);
        Set<UUID> ownedIds = ownedIds(adventurer);

        CompetencesDisponiblesResponse response = new CompetencesDisponiblesResponse();
        for (CompetenceEntity competence : competenceRepository.findAll()) {
            if (ownedIds.contains(competence.getId())) {
                continue;
            }
            List<CompetenceDomain.MissingPrerequis> missing =
                    competenceDomain.checkPrerequisites(adventurer, competence, ownedIds);
            if (missing.isEmpty()) {
                response.addAcquerablesItem(competenceMapper.toDto(competence));
            } else {
                CompetencesDisponiblesResponseBloqueesInner bloquee =
                        new CompetencesDisponiblesResponseBloqueesInner();
                bloquee.setCompetence(CompetenceReference.builder()
                        .id(competence.getId())
                        .nom(competence.getNom())
                        .build());
                for (CompetenceDomain.MissingPrerequis m : missing) {
                    bloquee.addPrerequisManquantsItem(
                            CompetencesDisponiblesResponseBloqueesInnerPrerequisManquantsInner.builder()
                                    .type(CompetencesDisponiblesResponseBloqueesInnerPrerequisManquantsInner
                                            .TypeEnum.fromValue(m.type()))
                                    .detail(m.detail())
                                    .build());
                }
                response.addBloqueesItem(bloquee);
            }
        }
        return response;
    }

    private Set<UUID> ownedIds(AdventurerEntity adventurer) {
        return adventurer.getCompetences().stream()
                .map(CompetenceEntity::getId)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private AdventurerEntity findAdventurer(UUID id) {
        return adventurerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Aventurier non trouvé"));
    }

    private CompetenceEntity findCompetence(UUID id) {
        return competenceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Compétence non trouvée"));
    }
}
