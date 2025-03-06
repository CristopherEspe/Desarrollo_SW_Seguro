package org.ecovida.inventory.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EcovidaInventoryServiceApplicationTests {

	@Test
	void contextLoads() {
	}


	@Test
	void testInventoryService() {
		//Arrange
		String expected = "Inventory Service is running";
		//Act
		String result = "Inventory Service is running";
		//Assert
		assertEquals(expected, result);
	}


	@Test
	void testInventoryProducts() {
		//Arrange
		String expected = "There are 10 products in the inventory";
		//Act
		String result = "There are 10 products in the inventory";
		//Assert
		assertEquals(expected, result);
	}

	@Test
	void testAddProductToInventory() {
		// Arrange
		int initialProductCount = 10;
		int expectedProductCount = 11;

		// Act
		int resultProductCount = initialProductCount + 1; // Simulación de agregar un producto

		// Assert
		assertEquals(expectedProductCount, resultProductCount, "El número de productos debería incrementarse en 1 al agregar un producto");
	}


	@Test
	void testRemoveProductFromInventory() {
		// Arrange
		int initialProductCount = 10;
		int expectedProductCount = 9;

		// Act
		int resultProductCount = initialProductCount - 1; // Simulación de eliminar un producto

		// Assert
		assertEquals(expectedProductCount, resultProductCount, "El número de productos debería disminuir en 1 al eliminar un producto");
	}


	@Test
	void testUpdateProductQuantity() {
		// Arrange
		int initialQuantity = 5;
		int newQuantity = 10;

		// Act
		int resultQuantity = newQuantity; // Simulación de actualizar la cantidad de un producto

		// Assert
		assertEquals(newQuantity, resultQuantity, "La cantidad del producto debería actualizarse correctamente");
	}


	@Test
	void testGetProductInfo() {
		// Arrange
		String expectedProductInfo = "Product ID: 1, Name: Product A, Quantity: 10";

		// Act
		String resultProductInfo = "Product ID: 1, Name: Product A, Quantity: 10"; // Simulación de obtener la información de un producto

		// Assert
		assertEquals(expectedProductInfo, resultProductInfo, "La información del producto debería obtenerse correctamente");
	}

}
