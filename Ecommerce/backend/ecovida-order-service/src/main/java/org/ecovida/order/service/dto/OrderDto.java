package org.ecovida.order.service.dto;

import lombok.*;
import org.ecovida.order.service.model.OrderStatus;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String userId;
    private List<OrderItemDto> items;
    private Double total;
    private OrderStatus status;
    private String shippingAddress;
    private String shippingMethod;
    private String trackingNumber;
    private String paymentId;
    private Date createdAt;
    private Date updatedAt;
}
