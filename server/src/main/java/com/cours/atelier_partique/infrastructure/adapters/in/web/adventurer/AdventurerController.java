package com.cours.atelier_partique.infrastructure.adapters.in.web.adventurer;


import com.cours.atelier_partique.application.service.CreateAdventurerUseCase;
import com.cours.atelier_partique.application.service.ListAllAdventurerUseCase;
import com.cours.atelier_partique.infrastructure.web.openapi.api.AdventurersApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AdventurerController implements AdventurersApi {

    private final CreateAdventurerUseCase createAdventurerUseCase;

    private final ListAllAdventurerUseCase listAllAdventurerUseCase;

    @Override
    public AdventurerDto createAdventurer(
            @Parameter(name = "AdventurerPayload", description = "", required = true)
            @Valid @RequestBody AdventurerPayload adventurerPayload
    ) {
        return createAdventurerUseCase.execute(adventurerPayload);
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
        return listAllAdventurerUseCase.execute();
    }

    @Override
    public AdventurerDto updateAdventurer(UUID id, AdventurerPayload adventurerPayload) {
        return null;
    }
}
