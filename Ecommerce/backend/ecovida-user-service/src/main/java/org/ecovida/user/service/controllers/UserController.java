package org.ecovida.user.service.controllers;

import org.ecovida.user.service.services.UserService;
import org.ecovida.user.service.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

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

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") String id) {
        Optional<UserDto> user = userService.getByKeycloakId(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PostMapping("/{id}/cart/add")
    public ResponseEntity<UserDto> addToCart(@AuthenticationPrincipal Jwt jwt,
                                             @PathVariable String id,
                                             @RequestParam Long productId,
                                             @RequestParam Integer quantity,
                                             @RequestParam Double unitPrice) {
        String keycloakId = jwt.getSubject();
        if (!keycloakId.equals(id)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.addToCart(keycloakId, productId, quantity, unitPrice));
    }

    @PostMapping("/cart/clear/{userId}")
    public ResponseEntity<UserDto> clearCart(@AuthenticationPrincipal Jwt jwt, @PathVariable String userId) {
        String keycloakId = jwt.getSubject();
        if (!keycloakId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.clearCart(keycloakId));
    }
}