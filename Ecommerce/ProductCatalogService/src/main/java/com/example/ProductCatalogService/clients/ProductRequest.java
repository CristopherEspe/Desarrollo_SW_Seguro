package com.example.ProductCatalogService.clients;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductRequest {
    private Long categoryId;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;

}
