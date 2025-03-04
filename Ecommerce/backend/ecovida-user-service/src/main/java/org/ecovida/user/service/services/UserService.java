package org.ecovida.user.service.services;

import org.ecovida.user.service.dto.OrderDto;
import org.ecovida.user.service.dto.UserDto;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<UserDto> getByKeycloakId(String keycloakId);
    UserDto addToCart(String keycloakId, Long productId, Integer quantity, Double unitPrice);
    UserDto clearCart(String keycloakId);
}