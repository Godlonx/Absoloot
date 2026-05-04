package com.cours.atelier_partique.features.auth.usecase;

import com.cours.atelier_partique.domain.InvalidCredentialsException;
import com.cours.atelier_partique.features.auth.JwtService;
import com.cours.atelier_partique.features.auth.UserRepository;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UserCredentials;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LoginUseCase {
    private UserRepository userRepository;
    private JwtService jwtService;
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setJwtService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Autowired
    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public LoginData execute(UserCredentials credentials) {
        var user = userRepository.findByUsername(credentials.getUsername())
            .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        var token = jwtService.generateToken(user);

        var response = new LoginData();
        response.setToken(token);
        response.setRole(LoginData.RoleEnum.fromValue(user.getRole().toString()));

        return response;
    }
}
