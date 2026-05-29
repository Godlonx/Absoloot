package com.cours.atelier_partique.domain.exeption;

/**
 * Invalid skill request (400): self-requirement or unknown required skill.
 */
public class InvalidSkillRequestException extends InvalidRequestException {
    public InvalidSkillRequestException(String message) {
        super(message);
    }
}
