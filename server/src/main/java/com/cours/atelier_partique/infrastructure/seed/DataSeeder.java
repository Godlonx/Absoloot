package com.cours.atelier_partique.infrastructure.seed;

import com.cours.atelier_partique.domain.model.AdventurerClass;
import com.cours.atelier_partique.domain.model.Role;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AdventurerEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.AttributeMinEmbeddable;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.SkillEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.UserEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaAdventurerRepository;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaSkillRepository;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaUserRepository;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AttributeMin;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequisite;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Seeds the database with the same data as the frontend mocks so front and
 * back stay consistent. Entities are saved directly through the repositories
 * (the creation use cases would reject levels &gt; 1).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final JpaSkillRepository skillRepository;
    private final JpaAdventurerRepository adventurerRepository;
    private final JpaUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (skillRepository.count() == 0 && adventurerRepository.count() == 0) {
            Map<String, SkillEntity> skills = seedSkills();
            Map<String, AdventurerEntity> adventurers = seedAdventurers();
            seedLinks(adventurers, skills);
            log.info("Seeded {} skills, {} adventurers", skills.size(), adventurers.size());
        }
    }

    private void seedUsers() {
        UserEntity admin = new UserEntity();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        UserEntity viewer = new UserEntity();
        viewer.setUsername("viewer");
        viewer.setPassword(passwordEncoder.encode("viewer123"));
        viewer.setRole(Role.VIEWER);
        userRepository.save(viewer);

        log.info("Seeded users: admin/admin123 (ADMIN), viewer/viewer123 (VIEWER)");
    }

    private Map<String, SkillEntity> seedSkills() {
        Map<String, SkillEntity> byMockId = new HashMap<>();

        byMockId.put("skill-001", buildSkill("Weapon Mastery",
                "Allows efficient use of all standard melee weapons.",
                null, 5, attr(AttributeMin.AttributeEnum.PHYSICAL, 15)));
        byMockId.put("skill-002", buildSkill("Magic Channeling",
                "Ability to channel magical energy to cast spells.",
                Prerequisite.ClassRequiredEnum.MAGE, 10, attr(AttributeMin.AttributeEnum.MENTAL, 25)));
        byMockId.put("skill-003", buildSkill("Berserker Rage",
                "Enters a devastating fury increasing damage but reducing defense.",
                Prerequisite.ClassRequiredEnum.BARBARIAN, 15, attr(AttributeMin.AttributeEnum.PHYSICAL, 30)));
        byMockId.put("skill-004", buildSkill("Teleportation",
                "Allows teleporting over short distances.",
                Prerequisite.ClassRequiredEnum.MAGE, 25, attr(AttributeMin.AttributeEnum.MENTAL, 35)));
        byMockId.put("skill-005", buildSkill("Silent Strike",
                "Stealth attack dealing critical damage from the shadows.",
                Prerequisite.ClassRequiredEnum.ROGUE, 20, attr(AttributeMin.AttributeEnum.PERCEPTION, 30)));
        byMockId.put("skill-006", buildSkill("War Cry",
                "Lets out a terrifying cry that intimidates enemies and bolsters allies.",
                null, 30, attr(AttributeMin.AttributeEnum.PHYSICAL, 25)));
        byMockId.put("skill-007", buildSkill("Elemental Summoning",
                "Summons an elemental to fight at your side.",
                Prerequisite.ClassRequiredEnum.MAGE, 40, attr(AttributeMin.AttributeEnum.MENTAL, 40)));
        byMockId.put("skill-008", buildSkill("Night Vision",
                "Allows seeing perfectly in total darkness.",
                null, 10, attr(AttributeMin.AttributeEnum.PERCEPTION, 20)));
        byMockId.put("skill-009", buildSkill("Deep Meditation",
                "Quickly recovers mental energy through intense meditation.",
                Prerequisite.ClassRequiredEnum.MONK, 15, attr(AttributeMin.AttributeEnum.MENTAL, 25)));
        byMockId.put("skill-010", buildSkill("Divine Blessing",
                "Invokes the favor of the gods to heal and protect.",
                Prerequisite.ClassRequiredEnum.CLERIC, 20, attr(AttributeMin.AttributeEnum.MENTAL, 30)));

        skillRepository.saveAll(byMockId.values());

        link(byMockId, "skill-003", "skill-001");
        link(byMockId, "skill-004", "skill-002");
        link(byMockId, "skill-006", "skill-001");
        link(byMockId, "skill-007", "skill-002", "skill-004");

        skillRepository.saveAll(byMockId.values());
        return byMockId;
    }

    private Map<String, AdventurerEntity> seedAdventurers() {
        Map<String, AdventurerEntity> byMockId = new HashMap<>();
        byMockId.put("adv-001", buildAdventurer("Thorin Oakenshield", AdventurerClass.WARRIOR, 45, 42, 18, 25, "A legendary dwarven warrior, leader of the Company."));
        byMockId.put("adv-002", buildAdventurer("Elara Moonwhisper", AdventurerClass.MAGE, 38, 12, 45, 35, "An elven mage specialized in lunar magic."));
        byMockId.put("adv-003", buildAdventurer("Shadowbane", AdventurerClass.ROGUE, 52, 35, 28, 48, "A mysterious assassin whose real name no one knows."));
        byMockId.put("adv-004", buildAdventurer("Brother Marcus", AdventurerClass.CLERIC, 30, 15, 40, 30, "A priest devoted to serving the most destitute."));
        byMockId.put("adv-005", buildAdventurer("Lyra Swiftbow", AdventurerClass.RANGER, 28, 30, 22, 45, "An archer of the northern forests, expert tracker."));
        byMockId.put("adv-006", buildAdventurer("Grimlock the Unstoppable", AdventurerClass.BARBARIAN, 60, 50, 8, 15, "An orc berserker whose rage is legendary."));
        byMockId.put("adv-007", buildAdventurer("Seraphina Lightbringer", AdventurerClass.PALADIN, 42, 38, 32, 28, "A paladin in the service of divine light."));
        byMockId.put("adv-008", buildAdventurer("Zephyr Windwalker", AdventurerClass.MONK, 35, 32, 38, 40, "A monk who reached enlightenment through meditation."));
        byMockId.put("adv-009", buildAdventurer("Viktor Ironforge", AdventurerClass.WARRIOR, 25, 40, 20, 18, "A dwarven smith able to craft legendary weapons."));
        byMockId.put("adv-010", buildAdventurer("Nyx Shadowdancer", AdventurerClass.ROGUE, 48, 28, 30, 46, "A tiefling assassin mastering the arts of shadow."));
        byMockId.put("adv-011", buildAdventurer("Aldric Stormcaller", AdventurerClass.MAGE, 55, 10, 48, 32, "A human archmage specialized in elemental magic."));
        byMockId.put("adv-012", buildAdventurer("Kira Flameheart", AdventurerClass.WARRIOR, 33, 36, 20, 24, "A warrior with a fiery temper."));
        byMockId.put("adv-013", buildAdventurer("Orion Stargazer", AdventurerClass.RANGER, 40, 28, 25, 50, "A nocturnal ranger guided by the stars."));
        byMockId.put("adv-014", buildAdventurer("Sister Helena", AdventurerClass.CLERIC, 22, 12, 35, 28, "A novice but promising priestess."));

        adventurerRepository.saveAll(byMockId.values());
        return byMockId;
    }

    private void seedLinks(Map<String, AdventurerEntity> adventurers, Map<String, SkillEntity> skills) {
        Map<String, List<String>> links = new HashMap<>();
        links.put("adv-001", List.of("skill-001", "skill-003"));
        links.put("adv-002", List.of("skill-002", "skill-004"));
        links.put("adv-003", List.of("skill-001", "skill-005"));
        links.put("adv-006", List.of("skill-001", "skill-003", "skill-006"));
        links.put("adv-007", List.of("skill-001", "skill-002"));
        links.put("adv-011", List.of("skill-002", "skill-004", "skill-007"));

        links.forEach((advId, skillIds) -> {
            AdventurerEntity adventurer = adventurers.get(advId);
            for (String skillId : skillIds) {
                adventurer.getSkills().add(skills.get(skillId));
            }
        });
        adventurerRepository.saveAll(adventurers.values());
    }

    private SkillEntity buildSkill(String name, String description,
                                   Prerequisite.ClassRequiredEnum classRequired, Integer minimumLevel,
                                   AttributeMinEmbeddable attr) {
        SkillEntity entity = new SkillEntity();
        entity.setName(name);
        entity.setDescription(description);
        entity.setClassRequired(classRequired);
        entity.setMinimumLevel(minimumLevel);
        entity.setAttributeMin(attr);
        return entity;
    }

    private AttributeMinEmbeddable attr(AttributeMin.AttributeEnum attribute, int value) {
        AttributeMinEmbeddable embeddable = new AttributeMinEmbeddable();
        embeddable.setAttribute(attribute);
        embeddable.setValue(value);
        return embeddable;
    }

    private void link(Map<String, SkillEntity> byMockId, String target, String... prereqs) {
        SkillEntity entity = byMockId.get(target);
        for (String prereq : prereqs) {
            entity.getRequiredSkills().add(byMockId.get(prereq));
        }
    }

    private AdventurerEntity buildAdventurer(String name, AdventurerClass advClass,
                                             int level, int physical, int mental, int perception, String description) {
        AdventurerEntity entity = new AdventurerEntity();
        entity.setName(name);
        entity.setAdvClass(advClass);
        entity.setLevel(level);
        entity.setPhysical(physical);
        entity.setMental(mental);
        entity.setPerception(perception);
        entity.setDescription(description);
        return entity;
    }
}
