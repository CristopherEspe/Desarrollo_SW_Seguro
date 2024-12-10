package com.example.UserService.config;


import com.example.UserService.models.entities.Role;
import com.example.UserService.models.entities.User;
import com.example.UserService.repositories.RoleRepository;
import com.example.UserService.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class ConfigurationInitializer {
    private final Logger logger = Logger.getLogger(ConfigurationInitializer.class.getName());
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        createDirectories();
        createDefaultRoles();
        createAdminUser();
    }

    private void createDefaultRoles() {
        Role roleUser = roleRepository.findFirstByNameIgnoreCase("USER")
                .orElse(Role.builder().name("USER").description("Rol de usuario regular").build());
        Role roleAdmin = roleRepository.findFirstByNameIgnoreCase("ADMIN")
                .orElse(Role.builder().name("ADMIN").description("Rol de administrador").build());

        List<Role> roles = List.of(roleUser, roleAdmin);

        roles.forEach(role -> {
            boolean exists = role.getId() != null;

            if (!exists) {
                roleRepository.save(role);
                logger.info("Rol '" + role.getName() + "' creado exitosamente.");
            } else {
                logger.info("El rol '" + role.getName() + "' ya existe.");
            }
        });
    }

    private void createAdminUser() {
        if (userRepository.findByUsernameOrEmail("admin", "admin@admin.com").isPresent()) {
            logger.info("El usuario administrador ya existe.");
            return;
        }

        User user = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin"))
                .email("admin@admin.com")
                .phone("1234567890")
                .address("Quito, Ecuador")
                .lastname("admin")
                .name("admin")
                .role(roleRepository.findFirstByNameIgnoreCase("ADMIN").orElse(null))
                .build();
        User savedUser = userRepository.save(user);

        logger.info("Usuario administrador creado exitosamente.");
    }

    private void createDirectories() {
        createDirectory(Paths.get("uploads"));
        createDirectory(Paths.get("uploads/books-posters"));
    }

    private void createDirectory(Path path) {
        if (Files.notExists(path)) {
            try {
                Files.createDirectory(path);
                logger.info("Carpeta '" + path + "' creada exitosamente.");
            } catch (Exception e) {
                logger.severe("Error al crear la carpeta '" + path + "': " + e.getMessage());
            }
        } else {
            logger.info("La carpeta '" + path + "' ya existe.");
        }
    }
}
