package org.ecovida.product.service.service.impl;

import org.ecovida.product.service.dto.ProductDto;
import org.ecovida.product.service.entity.Product;
import org.ecovida.product.service.repository.ProductRepository;
import org.ecovida.product.service.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductDto> getAll() {
        List<Product> products = productRepository.findByOrderByIdDesc();
        return products.stream().map(this::mapToProductDto).toList();
    }

    @Override
    public Optional<ProductDto> getById(Long id) {
        return productRepository.findById(id).map(this::mapToProductDto);
    }

    @Override
    public ProductDto save(ProductDto productDto) {
        Product product = Product.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .imageUrl(productDto.getImageUrl())
                .category(productDto.getCategory())
                .createdAt(new Date())
                .build();

        Product saved = productRepository.save(product);
        return mapToProductDto(saved);
    }

    @Override
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El producto no existe."));
        productRepository.delete(product);
    }

    @Override
    public ProductDto update(ProductDto productDto) {
        Product product = productRepository.findById(productDto.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El producto no existe."));

        if (productDto.getName() != null && !productDto.getName().isEmpty()) product.setName(productDto.getName());
        if (productDto.getDescription() != null) product.setDescription(productDto.getDescription());
        if (productDto.getPrice() != null && productDto.getPrice() >= 0) product.setPrice(productDto.getPrice());
        if (productDto.getImageUrl() != null) product.setImageUrl(productDto.getImageUrl());
        if (productDto.getCategory() != null) product.setCategory(productDto.getCategory());
        product.setUpdatedAt(new Date());

        Product updated = productRepository.save(product);
        return mapToProductDto(updated);
    }

    @Override
    public List<ProductDto> fetchProductsByIds(List<Long> ids) {
        List<Product> products = productRepository.findAllById(ids);
        return products.stream().map(this::mapToProductDto).toList();
    }

    @Override
    public List<ProductDto> search(String query) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(query);
        return products.stream().map(this::mapToProductDto).toList();
    }

    private ProductDto mapToProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
