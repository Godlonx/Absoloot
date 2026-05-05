package com.cours.atelier_partique.application.service;

import com.cours.atelier_partique.domain.exeption.InvalidCredentialsException;
import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.UserEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.UserMapper;
import com.cours.atelier_partique.infrastructure.security.JwtService;
import com.cours.atelier_partique.application.ports.out.UserRepository;
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
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public LoginData execute(UserCredentials credentials) {
        UserEntity userEntity = userRepository.findByUsername(credentials.getUsername())
            .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));
            
        User user = userMapper.toUser(userEntity);


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
