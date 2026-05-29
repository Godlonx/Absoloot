package com.cours.atelier_partique.domain.model;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequis;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "competences", indexes = {@Index(name = "idx_competence_nom", columnList = "nom")})
public class CompetenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 120)
    private String nom;

    @Column(length = 500)
    private String description;

    /** Classe requise (null = accessible à toutes les classes). */
    @Enumerated(EnumType.STRING)
    @Column(name = "classe_requise", length = 30)
    private Prerequis.ClasseRequiseEnum classeRequise;

    /** Niveau minimum requis (null = aucune exigence). */
    @Column(name = "niveau_minimum")
    private Integer niveauMinimum;

    @Embedded
    private CaracteristiqueMinEmbeddable caracteristiqueMin;

    /** Compétences qui doivent être déjà acquises pour obtenir celle-ci. */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "competence_prerequis",
            joinColumns = @JoinColumn(name = "competence_id"),
            inverseJoinColumns = @JoinColumn(name = "prerequis_id")
    )
    private Set<CompetenceEntity> competencesRequises = new HashSet<>();
}
