package com.cours.atelier_partique.features.auth.usecase;

import com.cours.atelier_partique.domain.UserAlreadyExistsException;
import com.cours.atelier_partique.features.auth.JwtService;
import com.cours.atelier_partique.features.auth.UserRepository;
import com.cours.atelier_partique.infrastructure.database.models.UserEntity;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RegisterUseCase {
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

    public LoginData execute(RegisterCredentials credentials) {
        var existingUser = userRepository.findByUsername(credentials.getUsername());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("Username '" + credentials.getUsername() + "' already exists");
        }

        var hashedPassword = passwordEncoder.encode(credentials.getPassword());
        var user = new UserEntity();
        user.setUsername(credentials.getUsername());
        user.setPassword(hashedPassword);
        user.setRole(UserEntity.Role.VIEWER);

        var savedUser = userRepository.save(user);
        var token = jwtService.generateToken(savedUser);

        var response = new LoginData();
        response.setToken(token);
        response.setRole(LoginData.RoleEnum.fromValue(savedUser.getRole().toString()));

        return response;
    }
}
