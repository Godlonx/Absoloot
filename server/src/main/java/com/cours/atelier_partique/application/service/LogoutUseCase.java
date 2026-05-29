package com.cours.atelier_partique.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LogoutUseCase {

    public void execute() {
        log.info("User logged out successfully");
    }
}
