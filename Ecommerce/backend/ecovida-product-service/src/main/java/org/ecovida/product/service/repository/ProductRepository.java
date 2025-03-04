package org.ecovida.product.service.repository;

import org.ecovida.product.service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByOrderByIdDesc();
    List<Product> findByNameContainingIgnoreCase(String query);
}
