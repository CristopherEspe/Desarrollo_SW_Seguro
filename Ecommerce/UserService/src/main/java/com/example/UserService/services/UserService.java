package com.example.UserService.services;

import com.example.UserService.models.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAll();
    Optional<User> getById(Long id);
    User save(User usuario);
    void delete(Long id);
    void update(User usuario);
}
