package org.ecovida.user.service.client;

import org.ecovida.user.service.dto.OrderDto;
import org.ecovida.user.service.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;

@FeignClient(name = "order-service", url = "${app.feign.order-service.url}")
public interface OrderServiceClient {
    @GetMapping("/orders/user/{userId}")
    List<OrderDto> getOrdersByUserId(@PathVariable("userId") String userId);

    @GetMapping("/users/{id}")
    Optional<UserDto> getUserById(@PathVariable("id") String userId);

    @PostMapping("/users/cart/clear/{userId}")
    void clearCart(@PathVariable("userId") String userId);
}
