package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.out.UserRepository;
import com.cours.atelier_partique.domain.exeption.InvalidCredentialsException;
import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.in.web.auth.AuthRestMapper;
import com.cours.atelier_partique.infrastructure.security.JwtService;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.UserCredentials;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginUseCase {
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthRestMapper authRestMapper;
    private final UserRepository userRepository;

    public LoginData execute(UserCredentials credentials) {
        User user = userRepository.findByUsername(credentials.getUsername())
            .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        var token = jwtService.generateToken(user);

        return authRestMapper.toLoginData(token);
    }
}
