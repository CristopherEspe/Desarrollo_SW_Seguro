package org.ecovida.order.service.client;

import org.ecovida.order.service.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@FeignClient(name = "user-service", url = "${app.feign.user-service.url}")
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    Optional<UserDto> getUserById(@PathVariable("id") String id);

    @PostMapping("/users/cart/clear/{userId}")
    void clearCart(@PathVariable("userId") String userId);
}