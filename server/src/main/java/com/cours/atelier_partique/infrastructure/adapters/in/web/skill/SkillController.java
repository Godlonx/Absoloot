package com.cours.atelier_partique.infrastructure.adapters.in.web.skill;

import com.cours.atelier_partique.application.service.SkillService;
import com.cours.atelier_partique.infrastructure.web.openapi.api.SkillsApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LinkedAdventurersResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.ListSkills200Response;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SkillController implements SkillsApi {

    private final SkillService skillService;

    @Override
    public SkillDto createSkill(SkillPayload skillPayload) {
        return skillService.create(skillPayload);
    }

    @Override
    public void deleteSkill(UUID id) {
        skillService.delete(id);
    }

    @Override
    public SkillDto getSkill(UUID id) {
        return skillService.get(id);
    }

    @Override
    public LinkedAdventurersResponse listLinkedAdventurers(UUID id) {
        return skillService.listLinkedAdventurers(id);
    }

    @Override
    public ListSkills200Response listSkills(Integer page, Integer size) {
        return skillService.list(page == null ? 0 : page, size == null ? 20 : size);
    }

    @Override
    public SkillDto updateSkill(UUID id, SkillPayload skillPayload) {
        return skillService.update(id, skillPayload);
    }
}
