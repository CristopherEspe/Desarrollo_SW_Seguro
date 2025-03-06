describe('Aplicación E2E Tests', () => {

    beforeEach(() => {
      cy.viewport(1280, 720); // Ajusta la resolución
    });
  
    // ---- USUARIOS ----
    describe('Users Page Tests', () => {
      beforeEach(() => {
        cy.visit('/users');
      });
  
      it('Debería cargar la página de usuario y mostrar información', () => {
        cy.contains('Mi Perfil').should('be.visible');
        cy.get('table').should('exist');
      });
  
      it('Debería limpiar el carrito del usuario', () => {
        cy.get('[data-test="clear-cart-button"]').click();
        cy.contains('Carrito limpiado correctamente').should('be.visible');
      });
  
      it('Debería crear una orden desde el carrito', () => {
        cy.get('[data-test="create-order-button"]').click();
        cy.contains('Orden creada correctamente').should('be.visible');
      });
    });
  
    // ---- PRODUCTOS ----
    describe('Products Page Tests', () => {
      it('Debería cargar productos en la página pública', () => {
        cy.visit('/products');
        cy.contains('Productos').should('be.visible');
        cy.get('table').should('exist');
      });
  
      it('No debería permitir acceso a /products/admin sin autenticación', () => {
        cy.visit('/products/admin', { failOnStatusCode: false });
        cy.contains('Acceso denegado').should('exist');
      });
  
      it('Debería permitir gestionar productos si es administrador', () => {
        cy.loginAsAdmin(); // Debes definir un comando de login en `commands.ts`
        cy.visit('/products/admin');
        cy.contains('Gestión de Productos').should('be.visible');
      });
  
      it('Debería crear un nuevo producto', () => {
        cy.loginAsAdmin();
        cy.visit('/products/admin');
        cy.get('[data-test="create-product-button"]').click();
        cy.get('[data-test="product-name"]').type('Nuevo Producto');
        cy.get('[data-test="product-price"]').type('100');
        cy.get('[data-test="save-product"]').click();
        cy.contains('Producto creado').should('be.visible');
      });
  
      it('Debería eliminar un producto', () => {
        cy.loginAsAdmin();
        cy.visit('/products/admin');
        cy.get('[data-test="delete-product-button"]').first().click();
        cy.contains('Producto eliminado').should('be.visible');
      });
    });
  
    // ---- ÓRDENES ----
    describe('Orders Page Tests', () => {
      it('Debería cargar órdenes del usuario', () => {
        cy.visit('/orders');
        cy.contains('Mis Órdenes').should('be.visible');
        cy.get('table').should('exist');
      });
  
      it('Debería procesar el pago de una orden', () => {
        cy.visit('/orders');
        cy.get('[data-test="pay-order-button"]').first().click();
        cy.get('[data-test="payment-method"]').type('VISA1234');
        cy.get('[data-test="confirm-payment"]').click();
        cy.contains('Pago procesado').should('be.visible');
      });
  
      it('Debería permitir gestionar todas las órdenes si es admin', () => {
        cy.loginAsAdmin();
        cy.visit('/orders/admin');
        cy.contains('Todas las Órdenes').should('be.visible');
      });
  
      it('No debería permitir acceso a /orders/admin sin autenticación', () => {
        cy.visit('/orders/admin', { failOnStatusCode: false });
        cy.contains('Acceso denegado').should('exist');
      });
    });
  
  });
  