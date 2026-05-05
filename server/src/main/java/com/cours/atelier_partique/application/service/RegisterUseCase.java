package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.application.ports.out.UserRepository;
import com.cours.atelier_partique.domain.exeption.UserAlreadyExistsException;
import com.cours.atelier_partique.domain.model.Role;
import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.in.web.auth.AuthRestMapper;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.UserEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.UserEntityMapper;
import com.cours.atelier_partique.infrastructure.security.JwtService;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaUserRepository;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegisterUseCase {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserEntityMapper userEntityMapper;
    private final AuthRestMapper authRestMapper;

    public LoginData execute(RegisterCredentials credentials) {

        Optional<User> existingUser = userRepository.findByUsername(credentials.getUsername());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("Username '" + credentials.getUsername() + "' already exists");
        }

        String hashedPassword = passwordEncoder.encode(credentials.getPassword());

        User user = authRestMapper.fromRegisterCredentials(credentials, hashedPassword);
        user.setRole(Role.VIEWER);

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return authRestMapper.toLoginData(savedUser.getRole(), token);
    }
}
