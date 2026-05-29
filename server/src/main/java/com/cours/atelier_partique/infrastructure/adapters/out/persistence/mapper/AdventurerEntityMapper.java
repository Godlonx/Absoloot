package com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper;

import com.cours.atelier_partique.domain.model.Adventurer;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdventurerEntityMapper {

    Adventurer fromEntity(AdventurerEntity adventurer);

    AdventurerEntity toEntity(Adventurer adventurer);

}
