package com.cours.atelier_partique.domain.service;

import com.cours.atelier_partique.domain.model.AdventurerEntity;
import com.cours.atelier_partique.domain.model.CaracteristiqueMinEmbeddable;
import com.cours.atelier_partique.domain.model.CompetenceEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CaracteristiqueMin;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Règles métier sur les compétences et leurs prérequis.
 * <p>
 * L'ordre d'évaluation (classeRequise, niveauMinimum, caracteristiqueMin,
 * competencesRequises) reflète celui de checkPrerequisites côté frontend afin
 * que le premier prérequis non satisfait retourné soit identique.
 */
@Component
public class CompetenceDomain {

    /** Type de prérequis, valeurs alignées sur le contrat OpenAPI. */
    public static final String TYPE_CLASSE = "classeRequise";
    public static final String TYPE_NIVEAU = "niveauMinimum";
    public static final String TYPE_CARAC = "caracteristiqueMin";
    public static final String TYPE_COMPETENCES = "competencesRequises";

    /** Un prérequis non satisfait, avec son type et un détail lisible. */
    public record MissingPrerequis(String type, String detail) {
    }

    /**
     * Retourne le premier prérequis non satisfait, ou empty si l'aventurier
     * peut acquérir la compétence. {@code ownedIds} sont les ids des compétences
     * déjà possédées.
     */
    public Optional<MissingPrerequis> firstMissingPrerequis(
            AdventurerEntity adventurer, CompetenceEntity competence, Set<UUID> ownedIds) {
        return checkPrerequisites(adventurer, competence, ownedIds).stream().findFirst();
    }

    /** Vrai si tous les prérequis sont satisfaits. */
    public boolean isEligible(AdventurerEntity adventurer, CompetenceEntity competence, Set<UUID> ownedIds) {
        return checkPrerequisites(adventurer, competence, ownedIds).isEmpty();
    }

    /**
     * Liste de tous les prérequis non satisfaits (dans l'ordre canonique).
     */
    public List<MissingPrerequis> checkPrerequisites(
            AdventurerEntity adventurer, CompetenceEntity competence, Set<UUID> ownedIds) {
        List<MissingPrerequis> missing = new ArrayList<>();

        if (competence.getClasseRequise() != null) {
            AdventurerDto.AdvClassEnum required = AdventurerDto.AdvClassEnum.fromValue(
                    competence.getClasseRequise().getValue());
            if (adventurer.getAdvClass() != required) {
                missing.add(new MissingPrerequis(TYPE_CLASSE,
                        "Classe " + competence.getClasseRequise().getValue() + " requise"));
            }
        }

        if (competence.getNiveauMinimum() != null
                && adventurer.getLevel() < competence.getNiveauMinimum()) {
            missing.add(new MissingPrerequis(TYPE_NIVEAU,
                    "Niveau minimum requis " + competence.getNiveauMinimum()
                            + ", niveau actuel " + adventurer.getLevel()));
        }

        CaracteristiqueMinEmbeddable carac = competence.getCaracteristiqueMin();
        if (carac != null && carac.getCaracteristique() != null && carac.getValeur() != null) {
            int actual = caracteristiqueValue(adventurer, carac.getCaracteristique());
            if (actual < carac.getValeur()) {
                missing.add(new MissingPrerequis(TYPE_CARAC,
                        carac.getCaracteristique().getValue() + " >= " + carac.getValeur()
                                + " requis (actuel " + actual + ")"));
            }
        }

        if (competence.getCompetencesRequises() != null) {
            for (CompetenceEntity required : competence.getCompetencesRequises()) {
                if (!ownedIds.contains(required.getId())) {
                    missing.add(new MissingPrerequis(TYPE_COMPETENCES,
                            "Compétence \"" + required.getNom() + "\" requise"));
                }
            }
        }

        return missing;
    }

    /**
     * Compétences déjà possédées qui dépendent de {@code competenceId} via leur
     * liste de competencesRequises. Empêche le retrait d'une dépendance (Règle 3).
     */
    public List<String> findDependentCompetences(
            UUID competenceId, Set<CompetenceEntity> ownedCompetences) {
        return ownedCompetences.stream()
                .filter(c -> !c.getId().equals(competenceId))
                .filter(c -> c.getCompetencesRequises().stream()
                        .anyMatch(r -> r.getId().equals(competenceId)))
                .map(CompetenceEntity::getNom)
                .collect(Collectors.toList());
    }

    private int caracteristiqueValue(AdventurerEntity adventurer, CaracteristiqueMin.CaracteristiqueEnum carac) {
        return switch (carac) {
            case PHYSICAL -> adventurer.getPhysical();
            case MENTAL -> adventurer.getMental();
            case PERCEPTION -> adventurer.getPerception();
        };
    }
}
