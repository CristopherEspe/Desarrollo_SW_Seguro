package org.ecovida.order.service.service;

import jakarta.transaction.Transactional;
import org.ecovida.order.service.client.InventoryServiceClient;
import org.ecovida.order.service.client.ProductServiceClient;
import org.ecovida.order.service.client.UserServiceClient;
import org.ecovida.order.service.dto.*;
import org.ecovida.order.service.model.Order;
import org.ecovida.order.service.model.OrderItem;
import org.ecovida.order.service.model.OrderStatus;
import org.ecovida.order.service.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private ProductServiceClient productServiceClient;

    @Autowired
    private InventoryServiceClient inventoryServiceClient;

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findByOrderByIdDesc().stream()
                .map(this::mapToOrderDto)
                .toList();
    }

    @Override
    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El pedido no existe."));
        return mapToOrderDto(order);
    }

    @Override
    @Transactional
    public OrderDto createOrderFromCart(String userId) {
        UserDto user = userServiceClient.getUserById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario no existe."));

        if (user.getCartItems() == null || user.getCartItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito está vacío.");
        }

        for (UserDto.CartItemDto cartItem : user.getCartItems()) {
            InventoryDto inventory = inventoryServiceClient.getByProductId(cartItem.getProductId());
            if (inventory.getStock() < cartItem.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No hay suficiente stock para el producto: " + cartItem.getProductId());
            }
        }

        Order order = Order.builder()
                .userId(userId) // Ahora es String
                .items(user.getCartItems().stream().map(cartItem ->
                        OrderItem.builder()
                                .productId(cartItem.getProductId())
                                .quantity(cartItem.getQuantity())
                                .unitPrice(cartItem.getUnitPrice())
                                .build()
                ).toList())
                .total(user.getCartSubtotal())
                .status(OrderStatus.PENDING)
                .shippingMethod("STANDARD")
                .createdAt(new Date())
                .build();

        for (UserDto.CartItemDto cartItem : user.getCartItems()) {
            inventoryServiceClient.updateStock(cartItem.getProductId(), cartItem.getQuantity(), false);
        }

        Order savedOrder = orderRepository.save(order);
        userServiceClient.clearCart(userId);

        return mapToOrderDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El pedido no existe."));
        order.setStatus(status);
        order.setUpdatedAt(new Date());
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderDto(updatedOrder);
    }

    @Override
    public List<OrderDto> getOrdersByUserId(String userId) { // Cambio a String
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToOrderDto)
                .toList();
    }

    @Override
    @Transactional
    public OrderDto shipOrder(Long orderId, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El pedido no existe."));

        if (order.getStatus() != OrderStatus.PAID) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El pedido debe estar pagado antes de enviarse.");
        }

        order.setStatus(OrderStatus.SHIPPED);
        order.setTrackingNumber(trackingNumber);
        order.setUpdatedAt(new Date());
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderDto(updatedOrder);
    }

    @Override
    @Transactional
    public OrderDto processPayment(Long orderId, String paymentMethodId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El pedido no existe."));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El pedido ya ha sido procesado o cancelado.");
        }

        String paymentId = "pay_" + System.currentTimeMillis(); // Simulado
        order.setPaymentId(paymentId);
        order.setStatus(OrderStatus.PAID);
        order.setUpdatedAt(new Date());
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderDto(updatedOrder);
    }

    private OrderDto mapToOrderDto(Order order) {
        List<Long> productIds = order.getItems().stream().map(OrderItem::getProductId).toList();
        List<ProductDto> products = productServiceClient.fetchProductsByIds(productIds);

        List<OrderItemDto> items = order.getItems().stream().map(item -> {
            ProductDto product = products.stream()
                    .filter(p -> p.getId().equals(item.getProductId()))
                    .findFirst().orElse(null);
            return OrderItemDto.builder()
                    .productId(item.getProductId())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .build();
        }).toList();

        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .items(items)
                .total(order.getTotal())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .shippingMethod(order.getShippingMethod())
                .trackingNumber(order.getTrackingNumber())
                .paymentId(order.getPaymentId())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}