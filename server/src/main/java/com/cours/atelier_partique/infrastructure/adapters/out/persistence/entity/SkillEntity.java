package com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.Prerequisite;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "skills", indexes = {@Index(name = "idx_skill_name", columnList = "name")})
public class SkillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "class_required", length = 30)
    private Prerequisite.ClassRequiredEnum classRequired;

    @Column(name = "minimum_level")
    private Integer minimumLevel;

    @Embedded
    private AttributeMinEmbeddable attributeMin;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "skill_required_skills",
            joinColumns = @JoinColumn(name = "skill_id"),
            inverseJoinColumns = @JoinColumn(name = "required_skill_id")
    )
    private Set<SkillEntity> requiredSkills = new HashSet<>();
}
