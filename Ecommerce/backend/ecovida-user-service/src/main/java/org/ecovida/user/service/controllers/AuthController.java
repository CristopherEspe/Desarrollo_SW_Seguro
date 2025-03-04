package org.ecovida.user.service.controllers;

import org.ecovida.user.service.dto.UserDto;
import org.ecovida.user.service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public UserDto getCurrentUser() {
        final Jwt principal = (Jwt) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        String keycloakId = principal.getSubject();
        return userService.getByKeycloakId(keycloakId)
                .map(user -> {
                    user.setEmail(principal.getClaimAsString("email"));
                    return user;
                })
                .orElseGet(() -> UserDto.builder()
                        .keycloakId(keycloakId)
                        .email(principal.getClaimAsString("email"))
                        .cartSubtotal(0.0)
                        .build());
    }
}
