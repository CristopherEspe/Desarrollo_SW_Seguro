package org.ecovida.product.service.clients;

import org.ecovida.product.service.dto.InventoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "inventory-service")
public interface InventoryServiceClient {
    @GetMapping("/inventory/product/{productId}")
    InventoryDto getInventoryByProductId(@PathVariable Long productId);

    @PostMapping("/inventory/products")
    List<InventoryDto> getInventoriesByProductIds(@RequestBody List<Long> productIds);

    @PostMapping("/inventory")
    void createInventory(@RequestParam Long productId, @RequestParam Integer initialStock);

    @DeleteMapping("/inventory/{productId}")
    void deleteInventory(@PathVariable Long productId);
}
