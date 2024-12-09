package com.example.UserService.services;

import com.example.UserService.models.entities.Role;
import com.example.UserService.models.entities.User;
import com.example.UserService.repositories.RoleRepository;
import com.example.UserService.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService{

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

    public void createAdminUser() {
        User adminUser = new User();
        adminUser.setName("Admin");
        adminUser.setLastname("User");
        adminUser.setAddress("Calle Admin 123");
        adminUser.setPhone("123456789");
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword(passwordEncoder.encode("admin")); // Encriptar la contraseña

        // Asignar roles (asegúrate de tener roles definidos)
        Set<Role> roles = new HashSet<>();
        roles.add(roleRepository.findByName("ROLE_ADMIN"));
        adminUser.setRoles(roles);

        userRepository.save(adminUser);
    }
}

