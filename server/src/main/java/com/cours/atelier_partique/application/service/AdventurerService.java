package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.in.AdventurerUseCase;
import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.domain.exeption.NotFoundException;
import com.cours.atelier_partique.domain.model.AdventurerEntity;
import com.cours.atelier_partique.domain.service.AdventurerDomain;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.AdventurerMapper;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdventurerService implements AdventurerUseCase {

    private final AdventurerRepository adventurerRepository;
    private final AdventurerDomain adventurerDomain;
    private final AdventurerMapper adventurerMapper;

    @Override
    @Transactional
    public AdventurerDto create(AdventurerPayload payload) {
        log.info("Creating adventurer {}", payload.getName());
        adventurerDomain.checkLevelAtCreation(payload.getLevel());
        AdventurerEntity entity = new AdventurerEntity();
        adventurerMapper.applyPayload(payload, entity);
        return adventurerMapper.toDto(adventurerRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public AdventurerDto get(UUID id) {
        return adventurerMapper.toDto(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdventurerDto> list() {
        return adventurerRepository.findAll().stream()
                .map(adventurerMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdventurerDto update(UUID id, AdventurerPayload payload) {
        AdventurerEntity entity = findOrThrow(id);
        adventurerDomain.checkLevelAtModification(entity.getLevel(), payload.getLevel());
        adventurerMapper.applyPayload(payload, entity);
        return adventurerMapper.toDto(adventurerRepository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        AdventurerEntity entity = findOrThrow(id);
        adventurerRepository.delete(entity);
    }

    private AdventurerEntity findOrThrow(UUID id) {
        return adventurerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Aventurier non trouvé"));
    }
}
