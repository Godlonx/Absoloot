package com.cours.atelier_partique.domain.model;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.AdventurerDto;
import jakarta.persistence.*;

import java.util.UUID;

public class Adventurer {
    private UUID id;

    private String name;

    private String description;

    private int level;

    private AdventurerDto.AdvClassEnum advClass;
}
