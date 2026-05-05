package com.cours.atelier_partique.infrastructure.adapters.in.web;


import com.cours.atelier_partique.infrastructure.web.openapi.api.AdventurersApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@Controller
public class AdventurerController implements AdventurersApi {

    @Override
    public AdventurerDto createAdventurer(
            @Parameter(name = "AdventurerPayload", description = "", required = true)
            @Valid @RequestBody AdventurerPayload adventurerPayload
    ) {
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
