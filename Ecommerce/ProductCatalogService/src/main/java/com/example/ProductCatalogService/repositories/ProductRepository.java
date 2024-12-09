package com.example.ProductCatalogService.repositories;

import com.example.ProductCatalogService.models.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}

