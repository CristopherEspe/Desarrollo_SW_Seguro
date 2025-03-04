package org.ecovida.user.service.dto;

import org.ecovida.user.service.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private Long userId;
    private List<OrderItemDto> items;
    private Double total;
    private OrderStatus status;
    private Date createdAt;
    private Date updatedAt;
    private UserDto user;
}
