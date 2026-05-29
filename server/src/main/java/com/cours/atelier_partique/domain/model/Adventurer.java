package com.cours.atelier_partique.domain.model;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter
public class Adventurer {
    private UUID id;

    private String name;

    private String description;

    private int level;

    private int mental;

    private int perception;

    private int physical;

    private AdventurerClass advClass;
}
