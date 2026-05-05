package com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository;

import com.cours.atelier_partique.application.ports.out.UserRepository;
import com.cours.atelier_partique.domain.exeption.UserAlreadyExistsException;
import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.UserEntity;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper.UserEntityMapper;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.repository.jpa.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserEntityMapper userEntityMapper;
    private final JpaUserRepository jpaUserRepository;

    @Override
    public User save(User user) {
        UserEntity entity = userEntityMapper.fromUser(user);
        UserEntity savedUser = jpaUserRepository.save(entity);
        return userEntityMapper.toUser(savedUser);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        Optional<UserEntity> entity = jpaUserRepository.findByUsername(username);
        return entity.map(userEntityMapper::toUser);
    }
}
