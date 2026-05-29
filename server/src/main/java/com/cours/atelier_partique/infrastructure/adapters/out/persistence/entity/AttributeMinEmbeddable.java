package com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.AttributeMin;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class AttributeMinEmbeddable {

    @Enumerated(EnumType.STRING)
    @Column(name = "attr_min_attribute", length = 20)
    private AttributeMin.AttributeEnum attribute;

    @Column(name = "attr_min_value")
    private Integer value;
}
