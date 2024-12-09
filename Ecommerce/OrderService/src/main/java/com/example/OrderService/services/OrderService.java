package com.example.OrderService.services;

import com.example.OrderService.clients.ProductCatalogFeignClient;
import com.example.OrderService.clients.UserFeignClient;
import com.example.OrderService.models.entities.Order;
import com.example.OrderService.models.entities.OrderItem;
import com.example.OrderService.models.entities.dtos.ProductDTO;
import com.example.OrderService.models.entities.dtos.UserDTO;
import com.example.OrderService.repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductCatalogFeignClient productClient;
    private final UserFeignClient customerClient;

    public OrderService(OrderRepository orderRepository, ProductCatalogFeignClient productClient, UserFeignClient customerClient) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
        this.customerClient = customerClient;
    }

    public Order createOrder(Order order) {
        double totalPrice = 0.0;

        for (OrderItem item : order.getItems()) {
            UserDTO user = customerClient.getUserById(order.getCustomerId());
            if (user == null) {
                throw new RuntimeException("User not found with ID: " + order.getCustomerId());
            }
            ProductDTO product = productClient.getProductById(item.getProductId());
            if (product == null) {
                throw new RuntimeException("Product not found with ID: " + item.getProductId());
            }
            order.setCustomerId(user.getId());
            item.setPrice(product.getPrice());
            totalPrice += item.getPrice() * item.getQuantity();
        }

        order.setTotalPrice(totalPrice);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }
}
