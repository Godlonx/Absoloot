package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.domain.model.Adventurer;
import com.cours.atelier_partique.domain.service.AdventurerDomain;
import com.cours.atelier_partique.infrastructure.adapters.in.web.adventurer.AdventurerRestMapper;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Slf4j
@Service
public class CreateAdventurerUseCase {

    private final AdventurerDomain adventurerDomain;
    private final AdventurerRepository adventurerRepository;
    private final AdventurerRestMapper adventurerRestMapper;

    public AdventurerDto execute(AdventurerPayload adventurerPayload) {
        Adventurer adventurer = adventurerRestMapper.fromPayloadToAdventurer(adventurerPayload);
        adventurerDomain.checkLevelAtCreation(adventurer.getLevel());
        Adventurer savedAdventurer = adventurerRepository.save(adventurer);
        return adventurerRestMapper.fromAdventurerToDto(savedAdventurer);
    }
}
