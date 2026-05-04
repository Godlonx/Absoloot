package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.domain.service.AdventurerDomain;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Slf4j
@Service
public class CreateAdventurerUseCaseImpl {

//    private final AdventurerDomain adventurerDomain;
//    private final AdventurerRepository adventurerRepository;
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
