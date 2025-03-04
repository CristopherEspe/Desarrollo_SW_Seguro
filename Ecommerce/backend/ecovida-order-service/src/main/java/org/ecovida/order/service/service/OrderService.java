package org.ecovida.order.service.service;

import org.ecovida.order.service.dto.OrderDto;
import org.ecovida.order.service.model.OrderStatus;

import java.util.List;

public interface OrderService {
    List<OrderDto> getAllOrders();
    OrderDto getOrderById(Long orderId);
    OrderDto createOrderFromCart(String userId);
    OrderDto updateOrderStatus(Long orderId, OrderStatus status);
    List<OrderDto> getOrdersByUserId(String userId);
    OrderDto shipOrder(Long orderId, String trackingNumber);
    OrderDto processPayment(Long orderId, String paymentMethodId);
}
