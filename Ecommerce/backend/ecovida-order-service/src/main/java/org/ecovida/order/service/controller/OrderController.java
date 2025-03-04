package org.ecovida.order.service.controller;

import org.ecovida.order.service.dto.OrderDto;
import org.ecovida.order.service.model.OrderStatus;
import org.ecovida.order.service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<OrderDto> createOrderFromCart(@PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrderFromCart(userId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getOrdersByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PostMapping("/{orderId}/ship")
    public ResponseEntity<OrderDto> shipOrder(@PathVariable Long orderId, @RequestParam String trackingNumber) {
        return ResponseEntity.ok(orderService.shipOrder(orderId, trackingNumber));
    }

    @PostMapping("/{orderId}/pay")
    public ResponseEntity<OrderDto> processPayment(@PathVariable Long orderId, @RequestParam String paymentMethodId) {
        return ResponseEntity.ok(orderService.processPayment(orderId, paymentMethodId));
    }
}