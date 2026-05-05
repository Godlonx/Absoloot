package com.cours.atelier_partique.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter
public class User {

    UUID id;

    String username;

    String password;

    Role role;
}