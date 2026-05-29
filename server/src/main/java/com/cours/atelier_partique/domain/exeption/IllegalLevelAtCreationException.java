package com.cours.atelier_partique.domain.exeption;

public class IllegalLevelAtCreationException extends InvalidRequestException {
    public IllegalLevelAtCreationException(int level) {
        super("New adventurer must be level 1, his current level is "+level);
    }
}
