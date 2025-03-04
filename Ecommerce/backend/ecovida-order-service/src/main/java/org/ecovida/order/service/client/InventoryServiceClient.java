package org.ecovida.order.service.client;

import org.ecovida.order.service.dto.InventoryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "inventory-service", url = "${app.feign.inventory-service.url}")
public interface InventoryServiceClient {
    @GetMapping("/inventory/product/{productId}")
    InventoryDto getByProductId(@PathVariable("productId") Long productId);

    @PostMapping("/inventory/update-stock")
    InventoryDto updateStock(@RequestParam("productId") Long productId, @RequestParam("quantity") Integer quantity, @RequestParam("isIncrement") Boolean isIncrement);

    @PostMapping("/inventory/products")
    List<InventoryDto> getInventoriesByProductIds(@RequestBody List<Long> productIds);
}
