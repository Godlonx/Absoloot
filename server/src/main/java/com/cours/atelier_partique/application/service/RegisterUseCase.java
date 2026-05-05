package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.out.UserRepository;
import com.cours.atelier_partique.domain.exeption.UserAlreadyExistsException;
import com.cours.atelier_partique.domain.model.Role;
import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.in.web.auth.AuthRestMapper;
import com.cours.atelier_partique.infrastructure.security.JwtService;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegisterUseCase {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthRestMapper authRestMapper;

    public LoginData execute(RegisterCredentials credentials) {
        userRepository.findByUsername(credentials.getUsername())
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException("Username '" + user.getUsername() + "' already exists");
                });

        String hashedPassword = passwordEncoder.encode(credentials.getPassword());

        User user = authRestMapper.fromRegisterCredentials(credentials, hashedPassword);
        user.setRole(Role.valueOf(credentials.getRole().getValue()));

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return authRestMapper.toLoginData(token);
    }
}
