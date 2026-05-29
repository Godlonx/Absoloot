package com.cours.atelier_partique.domain.exeption;

/**
 * Identifiants invalides ou non authentifié (401).
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
