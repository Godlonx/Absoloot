package com.cours.atelier_partique.domain.service;

import com.cours.atelier_partique.domain.exeption.IllegalLevelAtCreationException;
import com.cours.atelier_partique.domain.exeption.IllegalLevelAtModificationException;
import org.springframework.stereotype.Component;

@Component
public class AdventurerDomain {
    public void checkLevelAtCreation(int niveau) {
        if (niveau != 1) {
            throw new IllegalLevelAtCreationException(niveau);
        }
    }

    public void checkLevelAtModification(int initialLevel, int targetLevel) {
        if (initialLevel > targetLevel) {
            throw new IllegalLevelAtModificationException(initialLevel, targetLevel);
        }
        if (targetLevel > initialLevel + 1) {
            throw new IllegalLevelAtModificationException(initialLevel, targetLevel);
        }
    }
}
