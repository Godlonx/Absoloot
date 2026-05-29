package com.cours.atelier_partique.application.ports.in;

import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UserCredentials;

public interface AuthUseCase {
    LoginData login(UserCredentials credentials);

    LoginData register(RegisterCredentials credentials);
}
