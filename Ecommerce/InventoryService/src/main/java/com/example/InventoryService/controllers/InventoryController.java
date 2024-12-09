package com.example.InventoryService.controllers;

import com.example.InventoryService.models.entities.Inventory;
import com.example.InventoryService.services.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Inventory> getInventoryByProductId(@PathVariable Long productId) {
        return inventoryService.getInventoryByProductId(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Long productId,
            @RequestParam int quantity) {
        Inventory updatedInventory = inventoryService.updateInventory(productId, quantity);
        return ResponseEntity.ok(updatedInventory);
    }
}

