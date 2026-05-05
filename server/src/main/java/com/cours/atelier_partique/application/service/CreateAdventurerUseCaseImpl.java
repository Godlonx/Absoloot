package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.domain.model.Adventurer;
import com.cours.atelier_partique.domain.service.AdventurerDomain;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.AdventurerMapper;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Slf4j
@Service
public class CreateAdventurerUseCaseImpl {

    private final AdventurerDomain adventurerDomain;
    private final AdventurerRepository adventurerRepository;
    private final AdventurerMapper adventurerMapper;

    public AdventurerDto execute(AdventurerPayload adventurerPayload) {

        Adventurer adventurer = adventurerMapper.fromPayloadToAdventurer(adventurerPayload);
        adventurerDomain.checkLevelAtCreation(adventurer.getLevel());
        Adventurer savedAdventurer = adventurerRepository.save(adventurer);
        return adventurerMapper.fromAdventureToDto(savedAdventurer);
    }
}
