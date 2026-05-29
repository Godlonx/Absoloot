package com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper;

import com.cours.atelier_partique.domain.model.AdventurerClass;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AttributeMinEmbeddable;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.SkillEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AttributeMin;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequisite;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillReference;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Conversion of SkillEntity / AdventurerEntity to the generated API DTOs.
 */
@Component
public class SkillMapper {

    public SkillDto toDto(SkillEntity entity) {
        return SkillDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .prerequisite(toPrerequisite(entity))
                .build();
    }

    public SkillReference toReference(SkillEntity entity) {
        return SkillReference.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public AdventurerDto toAdventurerDto(AdventurerEntity entity) {
        return AdventurerDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .level(entity.getLevel())
                .advClass(advClass(entity.getAdvClass()))
                .physical(entity.getPhysical())
                .mental(entity.getMental())
                .perception(entity.getPerception())
                .description(entity.getDescription())
                .build();
    }

    private AdventurerDto.AdvClassEnum advClass(AdventurerClass advClass) {
        return advClass == null ? null : AdventurerDto.AdvClassEnum.fromValue(advClass.name());
    }

    private Prerequisite toPrerequisite(SkillEntity entity) {
        Prerequisite prerequisite = new Prerequisite();
        prerequisite.setClassRequired(entity.getClassRequired());
        prerequisite.setMinimumLevel(entity.getMinimumLevel());

        AttributeMinEmbeddable attr = entity.getAttributeMin();
        if (attr != null && attr.getAttribute() != null) {
            prerequisite.setAttributeMin(AttributeMin.builder()
                    .attribute(attr.getAttribute())
                    .value(attr.getValue())
                    .build());
        }

        List<SkillReference> required = new ArrayList<>();
        for (SkillEntity req : entity.getRequiredSkills()) {
            required.add(toReference(req));
        }
        prerequisite.setSkillsRequired(required);

        return prerequisite;
    }
}
