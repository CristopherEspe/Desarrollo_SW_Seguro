package com.example.OrderService.clients;

import com.example.OrderService.models.entities.dtos.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-catalog-service", url = "http://localhost:8001/api/products")
public interface ProductCatalogFeignClient {

    @GetMapping("/{id}")
    ProductDTO getProductById(@PathVariable Long id);
}


