package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.in.AuthUseCase;
import com.cours.atelier_partique.application.ports.out.UserRepository;
import com.cours.atelier_partique.domain.exeption.ConflictException;
import com.cours.atelier_partique.domain.exeption.UnauthorizedException;
import com.cours.atelier_partique.domain.model.Role;
import com.cours.atelier_partique.domain.model.UserEntity;
import com.cours.atelier_partique.infrastructure.security.JwtService;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UserCredentials;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements AuthUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public LoginData login(UserCredentials credentials) {
        UserEntity user = userRepository.findByUsername(credentials.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Identifiants invalides"));
        if (!passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Identifiants invalides");
        }
        return buildLoginData(user);
    }

    @Override
    @Transactional
    public LoginData register(RegisterCredentials credentials) {
        if (userRepository.existsByUsername(credentials.getUsername())) {
            throw new ConflictException("Utilisateur déjà existant");
        }
        UserEntity user = new UserEntity();
        user.setUsername(credentials.getUsername());
        user.setPassword(passwordEncoder.encode(credentials.getPassword()));
        user.setRole(Role.VIEWER);
        userRepository.save(user);
        return buildLoginData(user);
    }

    private LoginData buildLoginData(UserEntity user) {
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return LoginData.builder()
                .token(token)
                .role(LoginData.RoleEnum.fromValue(user.getRole().name()))
                .build();
    }
}
