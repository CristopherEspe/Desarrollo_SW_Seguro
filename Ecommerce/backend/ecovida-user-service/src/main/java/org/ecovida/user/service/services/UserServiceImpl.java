package org.ecovida.user.service.services;

import org.ecovida.user.service.dto.UserDto;
import org.ecovida.user.service.entity.CartItem;
import org.ecovida.user.service.entity.User;
import org.ecovida.user.service.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<UserDto> getByKeycloakId(String keycloakId) {
        return userRepository.findById(keycloakId).map(this::mapToUserDto);
    }

    @Override
    @Transactional
    public UserDto addToCart(String keycloakId, Long productId, Integer quantity, Double unitPrice) {
        User user = userRepository.findById(keycloakId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .keycloakId(keycloakId)
                            .cartSubtotal(0.0)
                            .cartItems(new ArrayList<>())
                            .build();
                    return userRepository.save(newUser);
                });

        CartItem cartItem = CartItem.builder()
                .productId(productId)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .build();
        user.getCartItems().add(cartItem);

        user.setCartSubtotal(user.getCartItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum());

        User updatedUser = userRepository.save(user);
        return mapToUserDto(updatedUser);
    }

    @Override
    @Transactional
    public UserDto clearCart(String keycloakId) {
        User user = userRepository.findById(keycloakId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
        user.getCartItems().clear();
        user.setCartSubtotal(0.0);
        User updatedUser = userRepository.save(user);
        return mapToUserDto(updatedUser);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .keycloakId(user.getKeycloakId())
                .cartItems(user.getCartItems().stream().map(item ->
                        UserDto.CartItemDto.builder()
                                .productId(item.getProductId())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .build()
                ).toList())
                .cartSubtotal(user.getCartSubtotal())
                .build();
    }
}