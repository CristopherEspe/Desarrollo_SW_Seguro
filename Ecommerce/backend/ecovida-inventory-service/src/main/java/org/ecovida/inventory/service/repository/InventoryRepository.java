package org.ecovida.inventory.service.repository;

import org.ecovida.inventory.service.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductId(Long productId);
    boolean existsByProductId(Long productId);
    List<Inventory> findByProductIdIn(List<Long> productIds);
    List<Inventory> findByOrderByIdDesc();
}
