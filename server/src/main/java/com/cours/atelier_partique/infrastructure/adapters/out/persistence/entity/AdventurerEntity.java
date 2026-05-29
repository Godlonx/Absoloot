package com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity;

import com.cours.atelier_partique.domain.model.AdventurerClass;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter @Setter
@Table(name = "adventurers", indexes = {@Index(name = "idx_adventurer_name", columnList = "name")})
public class AdventurerEntity {
    @Id // jakarta.persistence.Id;
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int mental;

    @Column(nullable = false)
    private int perception;

    @Column(nullable = false)
    private int physical;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AdventurerClass advClass;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "adventurer_skills",
            joinColumns = @JoinColumn(name = "adventurer_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<SkillEntity> skills = new HashSet<>();
}

