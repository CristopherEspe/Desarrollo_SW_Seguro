package com.example.ProductCatalogService.repositories;

import com.example.ProductCatalogService.models.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}


