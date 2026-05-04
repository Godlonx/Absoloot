package com.cours.atelier_partique.features.auth;

import com.cours.atelier_partique.infrastructure.database.models.UserEntity;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(UserEntity user) {
        var now = new Date();
        var expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("role", user.getRole().toString())
                .claim("userId", user.getId().toString())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}
