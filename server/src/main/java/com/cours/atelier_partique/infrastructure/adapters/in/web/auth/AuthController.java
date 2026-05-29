package com.cours.atelier_partique.infrastructure.adapters.in.web.auth;

import com.cours.atelier_partique.application.service.LoginUseCase;
import com.cours.atelier_partique.application.service.LogoutUseCase;
import com.cours.atelier_partique.application.service.RegisterUseCase;
import com.cours.atelier_partique.infrastructure.web.openapi.api.AuthenticationApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UserCredentials;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequiredArgsConstructor
public class AuthController implements AuthenticationApi {
    private final RegisterUseCase registerUseCase;
    private final LoginUseCase loginUseCase;
    private final LogoutUseCase logoutUseCase;

    @Override
    public LoginData register(RegisterCredentials registerCredentials) {
        return registerUseCase.execute(registerCredentials);
    }

    @Override
    public LoginData login(UserCredentials userCredentials) {
        return loginUseCase.execute(userCredentials);
    }

    @Override
    public void logout() {
        logoutUseCase.execute();
    }
}
