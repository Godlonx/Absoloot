package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.in.CompetenceUseCase;
import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.application.ports.out.CompetenceRepository;
import com.cours.atelier_partique.domain.exeption.ConflictException;
import com.cours.atelier_partique.domain.exeption.InvalidRequestException;
import com.cours.atelier_partique.domain.exeption.NotFoundException;
import com.cours.atelier_partique.domain.model.AdventurerEntity;
import com.cours.atelier_partique.domain.model.CaracteristiqueMinEmbeddable;
import com.cours.atelier_partique.domain.model.CompetenceEntity;
import com.cours.atelier_partique.domain.service.CompetenceDomain;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.AdventurerMapper;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.CompetenceMapper;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AventuriersLiesResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CaracteristiqueMin;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetencePayload;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.ListCompetences200Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

class InvalidPrereqRequestException extends InvalidRequestException {
    InvalidPrereqRequestException(String message) {
        super(message);
    }
}

@Service
@RequiredArgsConstructor
@Slf4j
public class CompetenceService implements CompetenceUseCase {

    private final CompetenceRepository competenceRepository;
    private final AdventurerRepository adventurerRepository;
    private final CompetenceDomain competenceDomain;
    private final CompetenceMapper competenceMapper;
    private final AdventurerMapper adventurerMapper;

    @Override
    @Transactional(readOnly = true)
    public ListCompetences200Response list(int page, int size) {
        Page<CompetenceEntity> result = competenceRepository.findAll(PageRequest.of(page, size));
        List<CompetenceDto> content = result.getContent().stream()
                .map(competenceMapper::toDto)
                .collect(Collectors.toList());
        return ListCompetences200Response.builder()
                .content(content)
                .totalElements((int) result.getTotalElements())
                .totalPages(result.getTotalPages())
                .currentPage(result.getNumber())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CompetenceDto get(UUID id) {
        return competenceMapper.toDto(findOrThrow(id));
    }

    @Override
    @Transactional
    public CompetenceDto create(CompetencePayload payload) {
        CompetenceEntity entity = new CompetenceEntity();
        applyPayload(payload, entity);
        return competenceMapper.toDto(competenceRepository.save(entity));
    }

    @Override
    @Transactional
    public CompetenceDto update(UUID id, CompetencePayload payload) {
        CompetenceEntity entity = findOrThrow(id);
        applyPayload(payload, entity);

        // Règle 2 : refuser si des aventuriers possesseurs ne satisferaient plus les nouveaux prérequis.
        List<ConflictException.AventurierInvalide> invalides = new ArrayList<>();
        for (AdventurerEntity adventurer : adventurerRepository.findAll()) {
            boolean owns = adventurer.getCompetences().stream()
                    .anyMatch(c -> c.getId().equals(id));
            if (!owns) {
                continue;
            }
            Set<UUID> ownedIds = ownedIds(adventurer);
            ownedIds.remove(id); // les autres prérequis ne doivent pas être satisfaits par la compétence elle-même
            competenceDomain.firstMissingPrerequis(adventurer, entity, ownedIds)
                    .ifPresent(missing -> invalides.add(new ConflictException.AventurierInvalide(
                            adventurer.getId().toString(), adventurer.getName(), missing.detail())));
        }
        if (!invalides.isEmpty()) {
            throw new ConflictException(
                    "Les aventuriers suivants ne satisfont plus les prérequis", null, invalides);
        }

        return competenceMapper.toDto(competenceRepository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        CompetenceEntity entity = findOrThrow(id);

        // Règle 3 : impossible de supprimer une compétence possédée par des aventuriers.
        boolean owned = adventurerRepository.findAll().stream()
                .anyMatch(a -> a.getCompetences().stream().anyMatch(c -> c.getId().equals(id)));
        if (owned) {
            throw new ConflictException(
                    "Impossible de supprimer une compétence possédée par des aventuriers");
        }

        // Détacher cette compétence des prérequis d'autres compétences avant suppression.
        for (CompetenceEntity dependent : competenceRepository.findByCompetencesRequises_Id(id)) {
            dependent.getCompetencesRequises().removeIf(c -> c.getId().equals(id));
            competenceRepository.save(dependent);
        }

        competenceRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public AventuriersLiesResponse listAventurersLinked(UUID competenceId) {
        CompetenceEntity competence = findOrThrow(competenceId);

        AventuriersLiesResponse response = new AventuriersLiesResponse();
        for (AdventurerEntity adventurer : adventurerRepository.findAll()) {
            Set<UUID> ownedIds = ownedIds(adventurer);
            if (ownedIds.contains(competenceId)) {
                response.addPossesseursItem(adventurerMapper.toDto(adventurer));
            } else if (competenceDomain.isEligible(adventurer, competence, ownedIds)) {
                response.addEligiblesItem(adventurerMapper.toDto(adventurer));
            }
        }
        return response;
    }

    /** Applique un payload (nom, description, prérequis) sur une entité. */
    private void applyPayload(CompetencePayload payload, CompetenceEntity entity) {
        entity.setNom(payload.getNom());
        entity.setDescription(payload.getDescription());

        if (payload.getClasseRequise() != null) {
            entity.setClasseRequise(com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequis
                    .ClasseRequiseEnum.fromValue(payload.getClasseRequise().getValue()));
        } else {
            entity.setClasseRequise(null);
        }
        entity.setNiveauMinimum(payload.getNiveauMinimum());

        CaracteristiqueMin caracDto = payload.getCaracteristiqueMin();
        if (caracDto != null && caracDto.getCaracteristique() != null) {
            CaracteristiqueMinEmbeddable carac = new CaracteristiqueMinEmbeddable();
            carac.setCaracteristique(caracDto.getCaracteristique());
            carac.setValeur(caracDto.getValeur());
            entity.setCaracteristiqueMin(carac);
        } else {
            entity.setCaracteristiqueMin(null);
        }

        Set<CompetenceEntity> requises = new HashSet<>();
        List<UUID> requiredIds = payload.getCompetencesRequises();
        if (requiredIds != null) {
            for (UUID requiredId : requiredIds) {
                if (entity.getId() != null && requiredId.equals(entity.getId())) {
                    throw new InvalidPrereqRequestException(
                            "Une compétence ne peut pas se requérir elle-même");
                }
                CompetenceEntity required = competenceRepository.findById(requiredId)
                        .orElseThrow(() -> new InvalidPrereqRequestException(
                                "Compétence requise introuvable : " + requiredId));
                requises.add(required);
            }
        }
        entity.setCompetencesRequises(requises);
    }

    private Set<UUID> ownedIds(AdventurerEntity adventurer) {
        return adventurer.getCompetences().stream()
                .map(CompetenceEntity::getId)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private CompetenceEntity findOrThrow(UUID id) {
        return competenceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Compétence non trouvée"));
    }
}
