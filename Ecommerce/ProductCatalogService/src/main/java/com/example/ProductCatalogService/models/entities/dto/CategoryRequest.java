package com.example.ProductCatalogService.models.entities.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CategoryRequest {
    private String name;
    private String description;
}
