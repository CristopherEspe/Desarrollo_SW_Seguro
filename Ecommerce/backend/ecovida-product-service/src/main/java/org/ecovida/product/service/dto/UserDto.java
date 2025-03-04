package org.ecovida.product.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String keycloakId;
    private String email;
    private List<CartItemDto> cartItems;
    private Double cartSubtotal;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDto {
        private Long productId;
        private Integer quantity;
        private Double unitPrice;
    }
}
