package com.cours.atelier_partique.infrastructure.adapters.in.web;

import com.cours.atelier_partique.application.ports.in.AuthUseCase;
import com.cours.atelier_partique.infrastructure.web.openapi.api.AuthenticationApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UserCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthenticationApi {

    private final AuthUseCase authUseCase;

    @Override
    public LoginData login(UserCredentials userCredentials) {
        return authUseCase.login(userCredentials);
    }

    @Override
    public LoginData register(RegisterCredentials registerCredentials) {
        return authUseCase.register(registerCredentials);
    }

    @Override
    public void logout() {
        // Architecture stateless : la suppression du token est gérée côté client.
    }
}
