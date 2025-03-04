package org.ecovida.inventory.service.controller;

import org.ecovida.inventory.service.dto.InventoryDto;
import org.ecovida.inventory.service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryDto>> getAllInventories() {
        return ResponseEntity.ok(inventoryService.getAll());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<InventoryDto> getInventoryByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<InventoryDto> createInventory(@RequestParam Long productId, @RequestParam Integer initialStock) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createInventory(productId, initialStock));
    }

    @PostMapping("/update-stock")
    public ResponseEntity<InventoryDto> updateStock(@RequestParam Long productId, @RequestParam Integer quantity, @RequestParam Boolean isIncrement) {
        return ResponseEntity.ok(inventoryService.updateStock(productId, quantity, isIncrement));
    }

    @PutMapping("/{productId}") // Nuevo endpoint
    public ResponseEntity<InventoryDto> setStock(@PathVariable Long productId, @RequestParam Integer stock) {
        return ResponseEntity.ok(inventoryService.setStock(productId, stock));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long productId) {
        inventoryService.deleteInventory(productId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/products")
    public ResponseEntity<List<InventoryDto>> getInventoriesByProductIds(@RequestBody List<Long> productIds) {
        return ResponseEntity.ok(inventoryService.getInventoriesByProductIds(productIds));
    }
}