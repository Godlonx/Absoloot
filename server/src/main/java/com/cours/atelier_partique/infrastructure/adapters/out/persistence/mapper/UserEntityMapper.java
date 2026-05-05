package com.cours.atelier_partique.infrastructure.adapters.out.persistence.mapper;

import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.adapters.out.persistence.entity.UserEntity;
import org.mapstruct.Mapper;

import java.util.Optional;

@Mapper(componentModel = "spring")
public interface UserEntityMapper {

    /*
    For mapping only Domain object <-> Entity
     */

    User toUser(UserEntity user);

    UserEntity fromUser(User user);
}
