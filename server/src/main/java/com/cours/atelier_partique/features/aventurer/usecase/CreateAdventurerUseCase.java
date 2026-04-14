package com.cours.atelier_partique.features.aventurer.usecase;

import com.cours.atelier_partique.features.aventurer.AdventurerDomain;
import com.cours.atelier_partique.features.aventurer.AdventurerRepository;
import com.cours.atelier_partique.infrastructure.database.models.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import com.cours.atelier_partique.features.aventurer.AdventurerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.UUID;


@RequiredArgsConstructor
@Slf4j
@Service
public class CreateAdventurerUseCase {

    private final AdventurerDomain adventurerDomain;
    private final AdventurerRepository adventurerRepository;
//    private final AdventurerMapper adventurerMapper;

//    public AdventurerDto execute(AdventurerPayload adventurerPayload) {
//        log.info("CreerAdventurerUseCase execute");
//        adventurerDomain.checkLevelAtCreation(adventurerPayload.getLevel());
//        AdventurerDto adventurerDto = buildAdventurer(adventurerPayload);
//        AdventurerEntity adventurer = adventurerMapper.fromDto(adventurerDto);
//        adventurerRepository.save(adventurer);
//        return adventurerDto;
//    }

//    private static @NonNull AdventurerDto buildAdventurer(AdventurerPayload adventurerPayload) {
//        AdventurerDto adventurerDto = new AdventurerDto();
//        UUID id = UUID.randomUUID();
//        AventurierMapper.fillAventurier(aventurierPayload, aventurier, id);
//        return aventurier;
//    }
}
