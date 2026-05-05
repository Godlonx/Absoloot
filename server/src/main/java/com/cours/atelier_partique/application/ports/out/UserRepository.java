package com.cours.atelier_partique.application.ports.out;

import com.cours.atelier_partique.domain.model.User;

import java.util.Optional;

public interface UserRepository {

    User save(User user);

    Optional<User> findByUsername(String username);
}
