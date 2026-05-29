package com.cours.atelier_partique.infrastructure.seed;

import com.cours.atelier_partique.application.ports.out.AdventurerRepository;
import com.cours.atelier_partique.application.ports.out.CompetenceRepository;
import com.cours.atelier_partique.application.ports.out.UserRepository;
import com.cours.atelier_partique.domain.model.AdventurerEntity;
import com.cours.atelier_partique.domain.model.CaracteristiqueMinEmbeddable;
import com.cours.atelier_partique.domain.model.CompetenceEntity;
import com.cours.atelier_partique.domain.model.Role;
import com.cours.atelier_partique.domain.model.UserEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CaracteristiqueMin;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequis;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Amorce la base avec les mêmes données que les mocks frontend
 * (client/src/mocks/data) afin que front et back soient cohérents.
 * Les entités sont sauvegardées directement via les repositories (les use cases
 * de création rejetteraient les niveaux > 1).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CompetenceRepository competenceRepository;
    private final AdventurerRepository adventurerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (competenceRepository.count() == 0 && adventurerRepository.count() == 0) {
            Map<String, CompetenceEntity> competences = seedCompetences();
            Map<String, AdventurerEntity> adventurers = seedAdventurers();
            seedLinks(adventurers, competences);
            log.info("Seeded {} competences, {} adventurers",
                    competences.size(), adventurers.size());
        }
    }

    private void seedUsers() {
        UserEntity admin = new UserEntity();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        entityManager.persist(admin);

        UserEntity viewer = new UserEntity();
        viewer.setUsername("viewer");
        viewer.setPassword(passwordEncoder.encode("viewer123"));
        viewer.setRole(Role.VIEWER);
        entityManager.persist(viewer);

        log.info("Seeded users: admin/admin123 (ADMIN), viewer/viewer123 (VIEWER)");
    }

    private Map<String, CompetenceEntity> seedCompetences() {
        Map<String, CompetenceEntity> byMockId = new HashMap<>();

        // Création sans prérequis chaînés d'abord (pour pouvoir les référencer ensuite).
        byMockId.put("comp-001", buildCompetence("comp-001", "Maîtrise des armes",
                "Permet d'utiliser efficacement toutes les armes de mêlée standard.",
                null, 5, carac(CaracteristiqueMin.CaracteristiqueEnum.PHYSICAL, 15)));
        byMockId.put("comp-002", buildCompetence("comp-002", "Canalisation magique",
                "Capacité à canaliser l'énergie magique pour lancer des sorts.",
                Prerequis.ClasseRequiseEnum.MAGE, 10, carac(CaracteristiqueMin.CaracteristiqueEnum.MENTAL, 25)));
        byMockId.put("comp-003", buildCompetence("comp-003", "Rage du berserker",
                "Entre dans une fureur dévastatrice augmentant les dégâts mais réduisant la défense.",
                Prerequis.ClasseRequiseEnum.BARBARE, 15, carac(CaracteristiqueMin.CaracteristiqueEnum.PHYSICAL, 30)));
        byMockId.put("comp-004", buildCompetence("comp-004", "Téléportation",
                "Permet de se téléporter sur de courtes distances.",
                Prerequis.ClasseRequiseEnum.MAGE, 25, carac(CaracteristiqueMin.CaracteristiqueEnum.MENTAL, 35)));
        byMockId.put("comp-005", buildCompetence("comp-005", "Frappe silencieuse",
                "Attaque furtive infligeant des dégâts critiques depuis les ombres.",
                Prerequis.ClasseRequiseEnum.VOLEUR, 20, carac(CaracteristiqueMin.CaracteristiqueEnum.PERCEPTION, 30)));
        byMockId.put("comp-006", buildCompetence("comp-006", "Cri de guerre",
                "Pousse un cri terrifiant qui intimide les ennemis et renforce les alliés.",
                null, 30, carac(CaracteristiqueMin.CaracteristiqueEnum.PHYSICAL, 25)));
        byMockId.put("comp-007", buildCompetence("comp-007", "Invocation élémentaire",
                "Invoque un élémentaire pour combattre à vos côtés.",
                Prerequis.ClasseRequiseEnum.MAGE, 40, carac(CaracteristiqueMin.CaracteristiqueEnum.MENTAL, 40)));
        byMockId.put("comp-008", buildCompetence("comp-008", "Vision nocturne",
                "Permet de voir parfaitement dans l'obscurité totale.",
                null, 10, carac(CaracteristiqueMin.CaracteristiqueEnum.PERCEPTION, 20)));
        byMockId.put("comp-009", buildCompetence("comp-009", "Méditation profonde",
                "Récupère rapidement l'énergie mentale par une méditation intense.",
                Prerequis.ClasseRequiseEnum.MOINE, 15, carac(CaracteristiqueMin.CaracteristiqueEnum.MENTAL, 25)));
        byMockId.put("comp-010", buildCompetence("comp-010", "Bénédiction divine",
                "Invoque la faveur des dieux pour soigner et protéger.",
                Prerequis.ClasseRequiseEnum.CLERC, 20, carac(CaracteristiqueMin.CaracteristiqueEnum.MENTAL, 30)));

        // Persistance initiale (ids générés par Hibernate).
        for (CompetenceEntity entity : byMockId.values()) {
            entityManager.persist(entity);
        }

        // Chaînage des prérequis (competencesRequises) : entités gérées, flush automatique.
        link(byMockId, "comp-003", "comp-001");
        link(byMockId, "comp-004", "comp-002");
        link(byMockId, "comp-006", "comp-001");
        link(byMockId, "comp-007", "comp-002", "comp-004");

        return byMockId;
    }

    private Map<String, AdventurerEntity> seedAdventurers() {
        Map<String, AdventurerEntity> byMockId = new HashMap<>();
        byMockId.put("adv-001", buildAdventurer("adv-001", "Thorin Oakenshield", AdventurerDto.AdvClassEnum.GUERRIER, 45, 42, 18, 25, "Un guerrier nain légendaire, chef de la Compagnie."));
        byMockId.put("adv-002", buildAdventurer("adv-002", "Elara Moonwhisper", AdventurerDto.AdvClassEnum.MAGE, 38, 12, 45, 35, "Une magicienne elfe spécialisée dans la magie lunaire."));
        byMockId.put("adv-003", buildAdventurer("adv-003", "Shadowbane", AdventurerDto.AdvClassEnum.VOLEUR, 52, 35, 28, 48, "Un assassin mystérieux dont personne ne connaît le vrai nom."));
        byMockId.put("adv-004", buildAdventurer("adv-004", "Brother Marcus", AdventurerDto.AdvClassEnum.CLERC, 30, 15, 40, 30, "Un prêtre dévoué au service des plus démunis."));
        byMockId.put("adv-005", buildAdventurer("adv-005", "Lyra Swiftbow", AdventurerDto.AdvClassEnum.RODEUR, 28, 30, 22, 45, "Une archère des forêts du Nord, experte en pistage."));
        byMockId.put("adv-006", buildAdventurer("adv-006", "Grimlock the Unstoppable", AdventurerDto.AdvClassEnum.BARBARE, 60, 50, 8, 15, "Un berserker orc dont la rage est légendaire."));
        byMockId.put("adv-007", buildAdventurer("adv-007", "Seraphina Lightbringer", AdventurerDto.AdvClassEnum.PALADIN, 42, 38, 32, 28, "Une paladine au service de la lumière divine."));
        byMockId.put("adv-008", buildAdventurer("adv-008", "Zephyr Windwalker", AdventurerDto.AdvClassEnum.MOINE, 35, 32, 38, 40, "Un moine ayant atteint l'illumination par la méditation."));
        byMockId.put("adv-009", buildAdventurer("adv-009", "Viktor Ironforge", AdventurerDto.AdvClassEnum.GUERRIER, 25, 40, 20, 18, "Un forgeron nain capable de créer des armes légendaires."));
        byMockId.put("adv-010", buildAdventurer("adv-010", "Nyx Shadowdancer", AdventurerDto.AdvClassEnum.VOLEUR, 48, 28, 30, 46, "Une assassine tiefling maîtrisant les arts de l'ombre."));
        byMockId.put("adv-011", buildAdventurer("adv-011", "Aldric Stormcaller", AdventurerDto.AdvClassEnum.MAGE, 55, 10, 48, 32, "Un archimage humain spécialisé dans la magie élémentaire."));
        byMockId.put("adv-012", buildAdventurer("adv-012", "Kira Flameheart", AdventurerDto.AdvClassEnum.GUERRIER, 33, 36, 20, 24, "Une guerrière au tempérament de feu."));
        byMockId.put("adv-013", buildAdventurer("adv-013", "Orion Stargazer", AdventurerDto.AdvClassEnum.RODEUR, 40, 28, 25, 50, "Un ranger nocturne guidé par les étoiles."));
        byMockId.put("adv-014", buildAdventurer("adv-014", "Sister Helena", AdventurerDto.AdvClassEnum.CLERC, 22, 12, 35, 28, "Une prêtresse novice mais prometteuse."));

        for (AdventurerEntity entity : byMockId.values()) {
            entityManager.persist(entity);
        }
        return byMockId;
    }

    private void seedLinks(Map<String, AdventurerEntity> adventurers, Map<String, CompetenceEntity> competences) {
        Map<String, List<String>> links = new HashMap<>();
        links.put("adv-001", List.of("comp-001", "comp-003"));
        links.put("adv-002", List.of("comp-002", "comp-004"));
        links.put("adv-003", List.of("comp-001", "comp-005"));
        links.put("adv-006", List.of("comp-001", "comp-003", "comp-006"));
        links.put("adv-007", List.of("comp-001", "comp-002"));
        links.put("adv-011", List.of("comp-002", "comp-004", "comp-007"));

        links.forEach((advId, compIds) -> {
            AdventurerEntity adventurer = adventurers.get(advId);
            for (String compId : compIds) {
                adventurer.getCompetences().add(competences.get(compId));
            }
            // Entité gérée : la liaison sera flushée à la fin de la transaction.
        });
    }

    private CompetenceEntity buildCompetence(String mockId, String nom, String description,
                                             Prerequis.ClasseRequiseEnum classe, Integer niveau,
                                             CaracteristiqueMinEmbeddable carac) {
        CompetenceEntity entity = new CompetenceEntity();
        entity.setNom(nom);
        entity.setDescription(description);
        entity.setClasseRequise(classe);
        entity.setNiveauMinimum(niveau);
        entity.setCaracteristiqueMin(carac);
        return entity;
    }

    private CaracteristiqueMinEmbeddable carac(CaracteristiqueMin.CaracteristiqueEnum type, int valeur) {
        CaracteristiqueMinEmbeddable carac = new CaracteristiqueMinEmbeddable();
        carac.setCaracteristique(type);
        carac.setValeur(valeur);
        return carac;
    }

    private void link(Map<String, CompetenceEntity> byMockId, String target, String... prereqs) {
        CompetenceEntity entity = byMockId.get(target);
        for (String prereq : prereqs) {
            entity.getCompetencesRequises().add(byMockId.get(prereq));
        }
    }

    private AdventurerEntity buildAdventurer(String mockId, String name, AdventurerDto.AdvClassEnum advClass,
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
