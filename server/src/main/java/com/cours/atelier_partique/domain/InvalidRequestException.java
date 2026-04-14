package com.cours.atelier_partique.domain;

public abstract class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
}
