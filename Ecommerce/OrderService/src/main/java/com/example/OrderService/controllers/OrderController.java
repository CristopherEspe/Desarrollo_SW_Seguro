package com.example.OrderService.controllers;

import com.example.OrderService.clients.ProductCatalogFeignClient;
import com.example.OrderService.clients.UserFeignClient;
import com.example.OrderService.models.entities.Order;
import com.example.OrderService.models.entities.dtos.ProductDTO;
import com.example.OrderService.models.entities.dtos.UserDTO;
import com.example.OrderService.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    private final ProductCatalogFeignClient productCatalogFeignClient;
    private final UserFeignClient userFeignClient;

    public OrderController(OrderService orderService, ProductCatalogFeignClient productCatalogFeignClient, UserFeignClient userFeignClient) {
        this.orderService = orderService;
        this.productCatalogFeignClient = productCatalogFeignClient;
        this.userFeignClient = userFeignClient;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/order/product/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productCatalogFeignClient.getProductById(id);
    }

    @GetMapping("/order/user/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return userFeignClient.getUserById(id);
    }
}
