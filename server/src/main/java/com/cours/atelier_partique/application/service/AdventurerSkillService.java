package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.domain.exeption.ConflictException;
import com.cours.atelier_partique.domain.exeption.NotFoundException;
import com.cours.atelier_partique.domain.exeption.PrerequisNonSatisfaitException;
import com.cours.atelier_partique.domain.service.SkillDomain;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.SkillEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.SkillMapper;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaAdventurerRepository;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaSkillRepository;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AvailableSkillsResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AvailableSkillsResponseLockedInner;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AvailableSkillsResponseLockedInnerUnmetPrerequisitesInner;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillReference;
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
public class AdventurerSkillService {

    private final JpaAdventurerRepository adventurerRepository;
    private final JpaSkillRepository skillRepository;
    private final SkillDomain skillDomain;
    private final SkillMapper skillMapper;

    @Transactional(readOnly = true)
    public List<SkillDto> list(UUID adventurerId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);
        return adventurer.getSkills().stream()
                .map(skillMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto add(UUID adventurerId, UUID skillId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);
        SkillEntity skill = findSkill(skillId);

        Set<UUID> ownedIds = ownedIds(adventurer);
        if (ownedIds.contains(skillId)) {
            throw new ConflictException("The adventurer already possesses this skill");
        }

        skillDomain.firstMissingPrerequisite(adventurer, skill, ownedIds)
                .ifPresent(missing -> {
                    throw new PrerequisNonSatisfaitException(
                            "Prerequisites are not satisfied", missing.type(), missing.detail());
                });

        adventurer.getSkills().add(skill);
        adventurerRepository.save(adventurer);
        return skillMapper.toDto(skill);
    }

    @Transactional
    public void remove(UUID adventurerId, UUID skillId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);

        boolean owns = adventurer.getSkills().stream().anyMatch(s -> s.getId().equals(skillId));
        if (!owns) {
            throw new NotFoundException("The adventurer does not possess this skill");
        }

        List<String> dependents = skillDomain.findDependentSkills(skillId, adventurer.getSkills());
        if (!dependents.isEmpty()) {
            throw new ConflictException(
                    "Cannot remove this skill",
                    "This skill is a prerequisite of " + String.join(", ", dependents));
        }

        adventurer.getSkills().removeIf(s -> s.getId().equals(skillId));
        adventurerRepository.save(adventurer);
    }

    @Transactional(readOnly = true)
    public AvailableSkillsResponse listAvailable(UUID adventurerId) {
        AdventurerEntity adventurer = findAdventurer(adventurerId);
        Set<UUID> ownedIds = ownedIds(adventurer);

        AvailableSkillsResponse response = new AvailableSkillsResponse();
        for (SkillEntity skill : skillRepository.findAll()) {
            if (ownedIds.contains(skill.getId())) {
                continue;
            }
            List<SkillDomain.MissingPrerequisite> missing =
                    skillDomain.checkPrerequisites(adventurer, skill, ownedIds);
            if (missing.isEmpty()) {
                response.addAcquirableItem(skillMapper.toDto(skill));
            } else {
                AvailableSkillsResponseLockedInner locked = new AvailableSkillsResponseLockedInner();
                locked.setSkill(SkillReference.builder()
                        .id(skill.getId())
                        .name(skill.getName())
                        .build());
                for (SkillDomain.MissingPrerequisite m : missing) {
                    locked.addUnmetPrerequisitesItem(
                            AvailableSkillsResponseLockedInnerUnmetPrerequisitesInner.builder()
                                    .type(AvailableSkillsResponseLockedInnerUnmetPrerequisitesInner
                                            .TypeEnum.fromValue(m.type()))
                                    .detail(m.detail())
                                    .build());
                }
                response.addLockedItem(locked);
            }
        }
        return response;
    }

    private Set<UUID> ownedIds(AdventurerEntity adventurer) {
        return adventurer.getSkills().stream()
                .map(SkillEntity::getId)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private AdventurerEntity findAdventurer(UUID id) {
        return adventurerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Adventurer not found"));
    }

    private SkillEntity findSkill(UUID id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Skill not found"));
    }
}
