package org.ecovida.inventory.service.client;

import org.ecovida.inventory.service.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@FeignClient(name = "product-service", url = "${app.feign.product-service.url}")
public interface ProductServiceClient {
    @GetMapping("/products/{id}")
    Optional<ProductDto> getProductById(@PathVariable("id") Long id);

    @PostMapping("/products/fetch-ids")
    List<ProductDto> fetchProductsByIds(@RequestBody List<Long> ids);
}
