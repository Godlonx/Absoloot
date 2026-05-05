package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.domain.exeption.UserAlreadyExistsException;
import com.cours.atelier_partique.domain.model.Role;
import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.UserMapper;
import com.cours.atelier_partique.infrastructure.security.JwtService;
import com.cours.atelier_partique.application.ports.out.UserRepository;
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

    public LoginData execute(RegisterCredentials credentials) {
        var existingUser = userRepository.findByUsername(credentials.getUsername());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("Username '" + credentials.getUsername() + "' already exists");
        }

        String hashedPassword = passwordEncoder.encode(credentials.getPassword());

        User user = new User();
        user.setUsername(credentials.getUsername());
        user.setPassword(hashedPassword);
        user.setRole(Role.VIEWER);


        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(user);

        var response = new LoginData();
        response.setToken(token);
        response.setRole(LoginData.RoleEnum.fromValue(savedUser.getRole().toString()));

        return response;
    }
}
