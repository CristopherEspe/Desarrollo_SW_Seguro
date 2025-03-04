package org.ecovida.product.service.clients;

import org.ecovida.product.service.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    Optional<UserDto> getUserById(@PathVariable("id") String id);

    @PostMapping("/users/cart/clear/{userId}")
    void clearCart(@PathVariable("userId") String userId);
}