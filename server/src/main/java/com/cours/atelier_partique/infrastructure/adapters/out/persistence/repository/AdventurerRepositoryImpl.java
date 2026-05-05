package com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository;

import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.domain.model.Adventurer;
import com.cours.atelier_partique.infrastructure.adapters.in.web.adventurer.AdventurerRestMapper;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.AdventurerEntityMapper;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaAdventurerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
@RequiredArgsConstructor
public class AdventurerRepositoryImpl implements AdventurerRepository {

    private final JpaAdventurerRepository jpaAdventurerRepository;
    private final AdventurerEntityMapper adventurerEntityMapper;

    @Override
    public Adventurer save(Adventurer adventurer) {
        AdventurerEntity adventurerEntity = adventurerEntityMapper.toEntity(adventurer);
        AdventurerEntity savedAdventurer = jpaAdventurerRepository.save(adventurerEntity);
        return adventurerEntityMapper.fromEntity(savedAdventurer);
    }

    @Override
    public List<Adventurer> findAll() {
        List<AdventurerEntity> adventurerEntities = jpaAdventurerRepository.findAll();
        return adventurerEntities.stream().map(adventurerEntityMapper::fromEntity).toList();
    }
}
