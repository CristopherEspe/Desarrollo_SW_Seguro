package org.ecovida.inventory.service.service;

import org.ecovida.inventory.service.dto.InventoryDto;

import java.util.List;

public interface InventoryService {
    List<InventoryDto> getAll();
    InventoryDto getByProductId(Long productId);
    InventoryDto createInventory(Long productId, Integer initialStock);
    InventoryDto updateStock(Long productId, Integer quantity, Boolean isIncrement);
    void deleteInventory(Long productId);
    List<InventoryDto> getInventoriesByProductIds(List<Long> productIds);
    InventoryDto setStock(Long productId, Integer stock);
}
