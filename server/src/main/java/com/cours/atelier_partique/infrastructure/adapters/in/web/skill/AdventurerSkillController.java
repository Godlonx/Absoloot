package com.cours.atelier_partique.infrastructure.adapters.in.web.skill;

import com.cours.atelier_partique.application.service.AdventurerSkillService;
import com.cours.atelier_partique.infrastructure.web.openapi.api.AdventurersSkillsApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AvailableSkillsResponse;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.SkillDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AdventurerSkillController implements AdventurersSkillsApi {

    private final AdventurerSkillService adventurerSkillService;

    @Override
    public SkillDto addSkillToAdventurer(UUID id, UUID skillId) {
        return adventurerSkillService.add(id, skillId);
    }

    @Override
    public List<SkillDto> listAdventurerSkills(UUID id) {
        return adventurerSkillService.list(id);
    }

    @Override
    public AvailableSkillsResponse listAvailableSkills(UUID id) {
        return adventurerSkillService.listAvailable(id);
    }

    @Override
    public void removeSkillFromAdventurer(UUID id, UUID skillId) {
        adventurerSkillService.remove(id, skillId);
    }
}
