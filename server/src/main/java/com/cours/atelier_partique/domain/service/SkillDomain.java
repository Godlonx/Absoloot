package com.cours.atelier_partique.domain.service;

import com.cours.atelier_partique.domain.model.AdventurerClass;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AttributeMinEmbeddable;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.SkillEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AttributeMin;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Business rules for skills and their prerequisites. The evaluation order
 * (classRequired, minimumLevel, attributeMin, skillsRequired) mirrors the
 * frontend so the first unmet prerequisite reported is identical.
 */
@Component
public class SkillDomain {

    public static final String TYPE_CLASS = "classRequired";
    public static final String TYPE_LEVEL = "minimumLevel";
    public static final String TYPE_ATTRIBUTE = "attributeMin";
    public static final String TYPE_SKILLS = "skillsRequired";

    /** An unmet prerequisite with its type and a human-readable detail. */
    public record MissingPrerequisite(String type, String detail) {
    }

    public Optional<MissingPrerequisite> firstMissingPrerequisite(
            AdventurerEntity adventurer, SkillEntity skill, Set<UUID> ownedIds) {
        return checkPrerequisites(adventurer, skill, ownedIds).stream().findFirst();
    }

    public boolean isEligible(AdventurerEntity adventurer, SkillEntity skill, Set<UUID> ownedIds) {
        return checkPrerequisites(adventurer, skill, ownedIds).isEmpty();
    }

    public List<MissingPrerequisite> checkPrerequisites(
            AdventurerEntity adventurer, SkillEntity skill, Set<UUID> ownedIds) {
        List<MissingPrerequisite> missing = new ArrayList<>();

        if (skill.getClassRequired() != null) {
            AdventurerClass required = AdventurerClass.valueOf(skill.getClassRequired().name());
            if (adventurer.getAdvClass() != required) {
                missing.add(new MissingPrerequisite(TYPE_CLASS,
                        "Class " + skill.getClassRequired().getValue() + " required"));
            }
        }

        if (skill.getMinimumLevel() != null && adventurer.getLevel() < skill.getMinimumLevel()) {
            missing.add(new MissingPrerequisite(TYPE_LEVEL,
                    "Minimum level required " + skill.getMinimumLevel()
                            + ", current level " + adventurer.getLevel()));
        }

        AttributeMinEmbeddable attr = skill.getAttributeMin();
        if (attr != null && attr.getAttribute() != null && attr.getValue() != null) {
            int actual = attributeValue(adventurer, attr.getAttribute());
            if (actual < attr.getValue()) {
                missing.add(new MissingPrerequisite(TYPE_ATTRIBUTE,
                        attr.getAttribute().getValue() + " >= " + attr.getValue()
                                + " required (current " + actual + ")"));
            }
        }

        if (skill.getRequiredSkills() != null) {
            for (SkillEntity required : skill.getRequiredSkills()) {
                if (!ownedIds.contains(required.getId())) {
                    missing.add(new MissingPrerequisite(TYPE_SKILLS,
                            "Skill \"" + required.getName() + "\" required"));
                }
            }
        }

        return missing;
    }

    /**
     * Owned skills that depend on {@code skillId} through their requiredSkills
     * list. Prevents removing a skill another owned skill depends on.
     */
    public List<String> findDependentSkills(UUID skillId, Set<SkillEntity> ownedSkills) {
        return ownedSkills.stream()
                .filter(s -> !s.getId().equals(skillId))
                .filter(s -> s.getRequiredSkills().stream()
                        .anyMatch(r -> r.getId().equals(skillId)))
                .map(SkillEntity::getName)
                .collect(Collectors.toList());
    }

    private int attributeValue(AdventurerEntity adventurer, AttributeMin.AttributeEnum attribute) {
        return switch (attribute) {
            case PHYSICAL -> adventurer.getPhysical();
            case MENTAL -> adventurer.getMental();
            case PERCEPTION -> adventurer.getPerception();
        };
    }
}
