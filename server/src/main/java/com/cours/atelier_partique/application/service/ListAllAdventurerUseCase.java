package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.infrastructure.adapters.in.web.adventurer.AdventurerRestMapper;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListAllAdventurerUseCase {

    private final AdventurerRepository adventurerRepository;

    private final AdventurerRestMapper adventurerRestMapper;

    public List<AdventurerDto> execute() {

        return adventurerRepository.findAll().stream().map(adventurerRestMapper::fromAdventurerToDto).toList();
    }
}
