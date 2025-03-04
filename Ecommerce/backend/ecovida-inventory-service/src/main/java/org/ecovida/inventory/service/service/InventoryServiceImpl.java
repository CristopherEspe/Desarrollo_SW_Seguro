package org.ecovida.inventory.service.service;

import org.ecovida.inventory.service.client.ProductServiceClient;
import org.ecovida.inventory.service.dto.InventoryDto;
import org.ecovida.inventory.service.dto.ProductDto;
import org.ecovida.inventory.service.model.Inventory;
import org.ecovida.inventory.service.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductServiceClient productServiceClient;

    @Override
    public List<InventoryDto> getAll() {
        List<InventoryDto> inventories = inventoryRepository.findByOrderByIdDesc().stream()
                .map(this::mapToInventoryDto)
                .toList();
        enrichWithProductDetails(inventories);
        return inventories;
    }

    @Override
    public InventoryDto getByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay inventario para el producto especificado."));
        return enrichWithProductDetails(mapToInventoryDto(inventory));
    }

    @Override
    @Transactional
    public InventoryDto createInventory(Long productId, Integer initialStock) {
        productServiceClient.getProductById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El producto no existe."));

        if (inventoryRepository.existsByProductId(productId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un registro de inventario para este producto.");
        }

        Inventory inventory = Inventory.builder()
                .productId(productId)
                .stock(initialStock >= 0 ? initialStock : 0)
                .lastUpdated(new Date())
                .build();

        Inventory saved = inventoryRepository.save(inventory);
        return enrichWithProductDetails(mapToInventoryDto(saved));
    }

    @Override
    @Transactional
    public InventoryDto updateStock(Long productId, Integer quantity, Boolean isIncrement) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay inventario para el producto especificado."));

        int newStock = isIncrement ? inventory.getStock() + quantity : inventory.getStock() - quantity;
        if (newStock < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El stock no puede ser negativo.");
        }

        inventory.setStock(newStock);
        inventory.setLastUpdated(new Date());
        Inventory updated = inventoryRepository.save(inventory);
        return enrichWithProductDetails(mapToInventoryDto(updated));
    }

    @Override
    @Transactional
    public InventoryDto setStock(Long productId, Integer stock) { // Nueva implementación
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay inventario para el producto especificado."));

        if (stock < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El stock no puede ser negativo.");
        }

        inventory.setStock(stock);
        inventory.setLastUpdated(new Date());
        Inventory updated = inventoryRepository.save(inventory);
        return enrichWithProductDetails(mapToInventoryDto(updated));
    }

    @Override
    @Transactional
    public void deleteInventory(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay inventario para el producto especificado."));
        inventoryRepository.delete(inventory);
    }

    @Override
    public List<InventoryDto> getInventoriesByProductIds(List<Long> productIds) {
        List<InventoryDto> inventories = inventoryRepository.findByProductIdIn(productIds).stream()
                .map(this::mapToInventoryDto)
                .toList();
        enrichWithProductDetails(inventories);
        return inventories;
    }

    private InventoryDto mapToInventoryDto(Inventory inventory) {
        return InventoryDto.builder()
                .id(inventory.getId())
                .productId(inventory.getProductId())
                .stock(inventory.getStock())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    private InventoryDto enrichWithProductDetails(InventoryDto inventoryDto) {
        ProductDto product = productServiceClient.getProductById(inventoryDto.getProductId())
                .orElse(null);
        inventoryDto.setProductId(product.getId());
        return inventoryDto;
    }

    private void enrichWithProductDetails(List<InventoryDto> inventories) {
        List<Long> productIds = inventories.stream().map(InventoryDto::getProductId).toList();
        List<ProductDto> products = productServiceClient.fetchProductsByIds(productIds);
        Map<Long, ProductDto> productMap = products.stream()
                .collect(Collectors.toMap(ProductDto::getId, Function.identity()));
        inventories.forEach(inventory -> inventory.setProductId(productMap.get(inventory.getProductId()).getId()));
    }
}