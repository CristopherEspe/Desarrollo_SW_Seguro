package com.example.ProductCatalogService.models.entities.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private Long categoryId;
}

