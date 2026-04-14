package com.cours.atelier_partique.features.aventurer;

import com.cours.atelier_partique.domain.IllegalLevelAtCreationException;
import com.cours.atelier_partique.domain.IllegalLevelAtModificationException;
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
