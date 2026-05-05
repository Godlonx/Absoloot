package com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper;

import com.cours.atelier_partique.domain.model.Adventurer;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdventurerMapper {
    AdventurerDto fromAdventureToDto(Adventurer adventurer);
    Adventurer fromPayloadToAdventurer(AdventurerPayload adventurerPayload);
}
