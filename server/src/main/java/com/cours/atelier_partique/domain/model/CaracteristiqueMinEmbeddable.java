package com.cours.atelier_partique.domain.model;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.CaracteristiqueMin;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

/**
 * Exigence de caractéristique minimale embarquée dans une compétence.
 */
@Embeddable
@Getter
@Setter
public class CaracteristiqueMinEmbeddable {

    @Enumerated(EnumType.STRING)
    @Column(name = "carac_min_caracteristique", length = 20)
    private CaracteristiqueMin.CaracteristiqueEnum caracteristique;

    @Column(name = "carac_min_valeur")
    private Integer valeur;
}
