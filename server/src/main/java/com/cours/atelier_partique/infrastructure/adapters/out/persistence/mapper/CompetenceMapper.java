package com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper;

import com.cours.atelier_partique.domain.model.CaracteristiqueMinEmbeddable;
import com.cours.atelier_partique.domain.model.CompetenceEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CaracteristiqueMin;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceDto;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.CompetenceReference;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequis;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Conversion CompetenceEntity <-> DTO de l'API générée.
 */
@Component
public class CompetenceMapper {

    public CompetenceDto toDto(CompetenceEntity entity) {
        return CompetenceDto.builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .description(entity.getDescription())
                .prerequis(toPrerequis(entity))
                .build();
    }

    public CompetenceReference toReference(CompetenceEntity entity) {
        return CompetenceReference.builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .build();
    }

    private Prerequis toPrerequis(CompetenceEntity entity) {
        Prerequis prerequis = new Prerequis();

        prerequis.setClasseRequise(entity.getClasseRequise());
        prerequis.setNiveauMinimum(entity.getNiveauMinimum());

        CaracteristiqueMinEmbeddable carac = entity.getCaracteristiqueMin();
        if (carac != null && carac.getCaracteristique() != null) {
            prerequis.setCaracteristiqueMin(CaracteristiqueMin.builder()
                    .caracteristique(carac.getCaracteristique())
                    .valeur(carac.getValeur())
                    .build());
        }

        List<CompetenceReference> requises = new ArrayList<>();
        for (CompetenceEntity required : entity.getCompetencesRequises()) {
            requises.add(toReference(required));
        }
        prerequis.setCompetencesRequises(requises);

        return prerequis;
    }
}
