package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.domain.exeption.ConflictException;
import com.cours.atelier_partique.domain.exeption.InvalidSkillRequestException;
import com.cours.atelier_partique.domain.exeption.NotFoundException;
import com.cours.atelier_partique.domain.service.SkillDomain;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AttributeMinEmbeddable;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.SkillEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.SkillMapper;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaAdventurerRepository;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaSkillRepository;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AttributeMin;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LinkedAdventurersResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.ListSkills200Response;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequisite;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillPayload;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class SkillService {

    private final JpaSkillRepository skillRepository;
    private final JpaAdventurerRepository adventurerRepository;
    private final SkillDomain skillDomain;
    private final SkillMapper skillMapper;

    @Transactional(readOnly = true)
    public ListSkills200Response list(int page, int size) {
        Page<SkillEntity> result = skillRepository.findAll(PageRequest.of(page, size));
        List<SkillDto> content = result.getContent().stream()
                .map(skillMapper::toDto)
                .collect(Collectors.toList());
        return ListSkills200Response.builder()
                .content(content)
                .totalElements((int) result.getTotalElements())
                .totalPages(result.getTotalPages())
                .currentPage(result.getNumber())
                .build();
    }

    @Transactional(readOnly = true)
    public SkillDto get(UUID id) {
        return skillMapper.toDto(findOrThrow(id));
    }

    @Transactional
    public SkillDto create(SkillPayload payload) {
        SkillEntity entity = new SkillEntity();
        applyPayload(payload, entity);
        return skillMapper.toDto(skillRepository.save(entity));
    }

    @Transactional
    public SkillDto update(UUID id, SkillPayload payload) {
        SkillEntity entity = findOrThrow(id);
        applyPayload(payload, entity);

        // Refuse if owners would no longer satisfy the new prerequisites.
        List<ConflictException.AventurierInvalide> invalid = new ArrayList<>();
        for (AdventurerEntity adventurer : adventurerRepository.findAll()) {
            boolean owns = adventurer.getSkills().stream().anyMatch(s -> s.getId().equals(id));
            if (!owns) {
                continue;
            }
            Set<UUID> ownedIds = ownedIds(adventurer);
            ownedIds.remove(id);
            skillDomain.firstMissingPrerequisite(adventurer, entity, ownedIds)
                    .ifPresent(missing -> invalid.add(new ConflictException.AventurierInvalide(
                            adventurer.getId().toString(), adventurer.getName(), missing.detail())));
        }
        if (!invalid.isEmpty()) {
            throw new ConflictException(
                    "The following adventurers no longer satisfy the prerequisites", null, invalid);
        }

        return skillMapper.toDto(skillRepository.save(entity));
    }

    @Transactional
    public void delete(UUID id) {
        SkillEntity entity = findOrThrow(id);

        boolean owned = adventurerRepository.findAll().stream()
                .anyMatch(a -> a.getSkills().stream().anyMatch(s -> s.getId().equals(id)));
        if (owned) {
            throw new ConflictException("Cannot delete a skill possessed by adventurers");
        }

        for (SkillEntity dependent : skillRepository.findByRequiredSkills_Id(id)) {
            dependent.getRequiredSkills().removeIf(s -> s.getId().equals(id));
            skillRepository.save(dependent);
        }

        skillRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public LinkedAdventurersResponse listLinkedAdventurers(UUID skillId) {
        SkillEntity skill = findOrThrow(skillId);

        LinkedAdventurersResponse response = new LinkedAdventurersResponse();
        for (AdventurerEntity adventurer : adventurerRepository.findAll()) {
            Set<UUID> ownedIds = ownedIds(adventurer);
            if (ownedIds.contains(skillId)) {
                response.addOwnersItem(skillMapper.toAdventurerDto(adventurer));
            } else if (skillDomain.isEligible(adventurer, skill, ownedIds)) {
                response.addEligibleItem(skillMapper.toAdventurerDto(adventurer));
            }
        }
        return response;
    }

    private void applyPayload(SkillPayload payload, SkillEntity entity) {
        entity.setName(payload.getName());
        entity.setDescription(payload.getDescription());

        if (payload.getClassRequired() != null) {
            entity.setClassRequired(
                    Prerequisite.ClassRequiredEnum.fromValue(payload.getClassRequired().getValue()));
        } else {
            entity.setClassRequired(null);
        }
        entity.setMinimumLevel(payload.getMinimumLevel());

        AttributeMin attrDto = payload.getAttributeMin();
        if (attrDto != null && attrDto.getAttribute() != null) {
            AttributeMinEmbeddable attr = new AttributeMinEmbeddable();
            attr.setAttribute(attrDto.getAttribute());
            attr.setValue(attrDto.getValue());
            entity.setAttributeMin(attr);
        } else {
            entity.setAttributeMin(null);
        }

        Set<SkillEntity> required = new HashSet<>();
        List<UUID> requiredIds = payload.getSkillsRequired();
        if (requiredIds != null) {
            for (UUID requiredId : requiredIds) {
                if (entity.getId() != null && requiredId.equals(entity.getId())) {
                    throw new InvalidSkillRequestException("A skill cannot require itself");
                }
                SkillEntity req = skillRepository.findById(requiredId)
                        .orElseThrow(() -> new InvalidSkillRequestException(
                                "Required skill not found: " + requiredId));
                required.add(req);
            }
        }
        entity.setRequiredSkills(required);
    }

    private Set<UUID> ownedIds(AdventurerEntity adventurer) {
        return adventurer.getSkills().stream()
                .map(SkillEntity::getId)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private SkillEntity findOrThrow(UUID id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Skill not found"));
    }
}
