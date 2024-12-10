package com.example.UserService.services.Impl;

import com.example.UserService.models.entities.User;
import com.example.UserService.repositories.RoleRepository;
import com.example.UserService.repositories.UserRepository;
import com.example.UserService.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository repository;

    @Override
    public List<User> getAll() {
        return repository.findAll();
    }

    @Override
    public Optional<User> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public User save(User usuario) {
        return repository.save(usuario);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public void update(User usuario) {
        repository.save(usuario);
    }
}

