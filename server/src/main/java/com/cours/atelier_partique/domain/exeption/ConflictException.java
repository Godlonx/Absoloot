package com.cours.atelier_partique.domain.exeption;

import lombok.Getter;

import java.util.List;

/**
 * Conflit métier (409). Peut transporter un détail textuel et/ou la liste
 * des aventuriers rendus invalides par l'opération.
 */
@Getter
public class ConflictException extends RuntimeException {

    private final String detail;
    private final List<AventurierInvalide> aventuriersInvalides;

    public ConflictException(String message) {
        this(message, null, null);
    }

    public ConflictException(String message, String detail) {
        this(message, detail, null);
    }

    public ConflictException(String message, String detail, List<AventurierInvalide> aventuriersInvalides) {
        super(message);
        this.detail = detail;
        this.aventuriersInvalides = aventuriersInvalides;
    }

    /** Aventurier rendu invalide par une modification de compétence. */
    public record AventurierInvalide(String id, String nom, String raison) {
    }
}
