package com.example.InventoryService.services;

import com.example.InventoryService.models.entities.Inventory;
import com.example.InventoryService.repositories.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public Optional<Inventory> getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId);
    }

    @Transactional
    public Inventory updateInventory(Long productId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    Inventory newInventory = new Inventory();
                    if (!productExists(productId)) {
                        throw new RuntimeException("Product with ID " + productId + " does not exist.");
                    }

                    newInventory.setProductId(productId);
                    newInventory.setQuantity(0);
                    newInventory.setCreatedAt(LocalDateTime.now());
                    newInventory.setUpdatedAt(LocalDateTime.now());
                    return inventoryRepository.save(newInventory);
                });

        inventory.setQuantity(quantity);
        inventory.setUpdatedAt(LocalDateTime.now());
        return inventoryRepository.save(inventory);
    }

    public boolean productExists(Long productId) {
        String productCatalogUrl = "http://localhost:8081/api/products/" + productId;
        RestTemplate restTemplate = new RestTemplate();

        try {
            restTemplate.getForObject(productCatalogUrl, String.class);
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        }
    }
}




