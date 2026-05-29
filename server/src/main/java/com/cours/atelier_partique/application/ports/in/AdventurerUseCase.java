package com.cours.atelier_partique.application.ports.in;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;

import java.util.List;
import java.util.UUID;

public interface AdventurerUseCase {
    AdventurerDto create(AdventurerPayload payload);

    AdventurerDto get(UUID id);

    List<AdventurerDto> list();

    AdventurerDto update(UUID id, AdventurerPayload payload);

    void delete(UUID id);
}
