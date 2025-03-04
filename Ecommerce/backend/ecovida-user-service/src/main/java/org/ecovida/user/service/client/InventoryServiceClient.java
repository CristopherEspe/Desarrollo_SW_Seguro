package org.ecovida.user.service.client;

import org.ecovida.user.service.dto.InventoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "inventory-service")
public interface InventoryServiceClient {
    @GetMapping("/inventory/product/{productId}")
    InventoryDto getByProductId(@PathVariable("productId") Long productId);
}