package com.cours.atelier_partique.infrastructure.adapters.in.web;

import com.cours.atelier_partique.application.ports.in.AdventurerUseCase;
import com.cours.atelier_partique.infrastructure.web.openapi.api.AdventurersApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AdventurerController implements AdventurersApi {

    private final AdventurerUseCase adventurerUseCase;

    @Override
    public AdventurerDto createAdventurer(AdventurerPayload adventurerPayload) {
        return adventurerUseCase.create(adventurerPayload);
    }

    @Override
    public void deleteAdventurer(UUID id) {
        adventurerUseCase.delete(id);
    }

    @Override
    public AdventurerDto getAdventurer(UUID id) {
        return adventurerUseCase.get(id);
    }

    @Override
    public List<AdventurerDto> listAdventurer() {
        return adventurerUseCase.list();
    }

    @Override
    public AdventurerDto updateAdventurer(UUID id, AdventurerPayload adventurerPayload) {
        return adventurerUseCase.update(id, adventurerPayload);
    }
}
