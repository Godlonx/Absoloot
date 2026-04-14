package com.cours.atelier_partique.features.aventurer;

import com.cours.atelier_partique.infrastructure.database.models.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;

public class AdventurerMapper {
    public AdventurerEntity fromDto(AdventurerDto adventurerDto) {
        AdventurerEntity entity = new AdventurerEntity();
        entity.setAdvClass(adventurerDto.getAdvClass());
        entity.setName(adventurerDto.getName());
        entity.setLevel(adventurerDto.getLevel());
        entity.setDescription(adventurerDto.getDescription());
        return entity;
    }
}
