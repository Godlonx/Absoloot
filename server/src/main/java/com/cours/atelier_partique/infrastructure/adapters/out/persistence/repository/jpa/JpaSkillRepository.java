package com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa;

import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaSkillRepository extends JpaRepository<SkillEntity, UUID> {

    List<SkillEntity> findByRequiredSkills_Id(UUID requiredSkillId);
}
