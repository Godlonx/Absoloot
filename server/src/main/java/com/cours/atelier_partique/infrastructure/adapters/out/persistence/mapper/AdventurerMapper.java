package com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper;

import com.cours.atelier_partique.domain.model.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import org.springframework.stereotype.Component;

/**
 * Conversion AdventurerEntity <-> DTO de l'API générée.
 */
@Component
public class AdventurerMapper {

    public AdventurerDto toDto(AdventurerEntity entity) {
        return AdventurerDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .level(entity.getLevel())
                .advClass(entity.getAdvClass())
                .physical(entity.getPhysical())
                .mental(entity.getMental())
                .perception(entity.getPerception())
                .description(entity.getDescription())
                .build();
    }

    /** Applique le contenu d'un payload sur une entité (création ou modification). */
    public void applyPayload(AdventurerPayload payload, AdventurerEntity entity) {
        entity.setName(payload.getName());
        entity.setLevel(payload.getLevel());
        entity.setAdvClass(advClassFromPayload(payload.getAdvClass()));
        entity.setPhysical(payload.getPhysical());
        entity.setMental(payload.getMental());
        entity.setPerception(payload.getPerception());
        entity.setDescription(payload.getDescription());
    }

    private AdventurerDto.AdvClassEnum advClassFromPayload(AdventurerPayload.AdvClassEnum value) {
        return value == null ? null : AdventurerDto.AdvClassEnum.fromValue(value.getValue());
    }
}
