package com.cours.atelier_partique.domain.exeption;

/**
 * Levée quand une ressource demandée n'existe pas (404).
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
