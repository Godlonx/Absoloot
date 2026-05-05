package com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AdventurerDto.AdvClassEnum advClass;

    // etc.

    // getters/setters
}

