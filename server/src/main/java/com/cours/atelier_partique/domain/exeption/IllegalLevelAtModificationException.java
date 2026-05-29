package com.cours.atelier_partique.domain.exeption;

public class IllegalLevelAtModificationException extends InvalidRequestException {
    public IllegalLevelAtModificationException(int currentLevel, int targetLevel) {
        super("The adventurer's level you're trying to reach is illegal. Current level : " + currentLevel + "; Target level : " + targetLevel);
    }
}
