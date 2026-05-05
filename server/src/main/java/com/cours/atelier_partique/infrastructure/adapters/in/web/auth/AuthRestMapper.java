package com.cours.atelier_partique.infrastructure.adapters.in.web.auth;

import com.cours.atelier_partique.domain.model.Role;
import com.cours.atelier_partique.domain.model.User;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.LoginData;
import com.cours.atelier_partique.infrastructure.web.openapi.dto.RegisterCredentials;
import com.zaxxer.hikari.util.Credentials;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthRestMapper {
    /*
    For mapping object DTO <-> Domain object only
    */

    @Mapping(source="hashword", target="password")
    User fromRegisterCredentials(RegisterCredentials credentials, String hashword);

    LoginData toLoginData(Role role, String token);
}
