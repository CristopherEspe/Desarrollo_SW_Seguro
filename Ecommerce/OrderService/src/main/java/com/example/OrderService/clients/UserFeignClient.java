package com.example.OrderService.clients;

import com.example.OrderService.models.entities.dtos.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "customer-service", url = "http://localhost:8003/api/users")
public interface UserFeignClient {
    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable Long id);
}
