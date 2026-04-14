package com.cours.atelier_partique.features.aventurer;


import com.cours.atelier_partique.infrastructure.web.openapi.api.AdventurersApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
public class AdventurerController implements AdventurersApi {

    @Override
    public AdventurerDto createAdventurer(AdventurerPayload adventurerPayload) {
        return null;
    }

    @Override
    public void deleteAdventurer(UUID id) {

    }

    @Override
    public AdventurerDto getAdventurer(UUID id) {
        return null;
    }

    @Override
    public List<AdventurerDto> listAdventurer() {
        return List.of();
    }

    @Override
    public AdventurerDto updateAdventurer(UUID id, AdventurerPayload adventurerPayload) {
        return null;
    }
}
