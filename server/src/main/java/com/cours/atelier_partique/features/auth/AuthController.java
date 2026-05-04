package com.cours.atelier_partique.features.auth;

import com.cours.atelier_partique.features.auth.usecase.LoginUseCase;
import com.cours.atelier_partique.features.auth.usecase.LogoutUseCase;
import com.cours.atelier_partique.features.auth.usecase.RegisterUseCase;
import com.cours.atelier_partique.infrastructure.web.openapi.api.AuthenticationApi;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UserCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class AuthController implements AuthenticationApi {
    @Autowired
    private RegisterUseCase registerUseCase;

    @Autowired
    private LoginUseCase loginUseCase;

    @Autowired
    private LogoutUseCase logoutUseCase;

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
