package com.cours.atelier_partique.application.ports.out;

import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    User save(User user);

    Optional<UserEntity> findByUsername(String username);
}
