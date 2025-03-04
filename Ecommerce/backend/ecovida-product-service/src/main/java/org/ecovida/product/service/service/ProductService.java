package org.ecovida.product.service.service;

import org.ecovida.product.service.dto.ProductDto;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<ProductDto> getAll();
    Optional<ProductDto> getById(Long id);
    ProductDto save(ProductDto product);
    void delete(Long id);
    ProductDto update(ProductDto product);
    List<ProductDto> fetchProductsByIds(List<Long> ids);
    List<ProductDto> search(String query);
}
