package com.cours.atelier_partique.domain.exeption;

import lombok.Getter;

/**
 * Prérequis non satisfait lors de l'attribution d'une compétence (422).
 * Le {@code type} correspond à l'un de : classeRequise, niveauMinimum,
 * caracteristiqueMin, competencesRequises.
 */
@Getter
public class PrerequisNonSatisfaitException extends RuntimeException {

    private final String type;
    private final String detail;

    public PrerequisNonSatisfaitException(String message, String type, String detail) {
        super(message);
        this.type = type;
        this.detail = detail;
    }
}
