declare namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>;
    }
  }
  
  Cypress.Commands.add('loginAsAdmin', () => {
    cy.visit('/login');
    cy.get('[data-test="email"]').type('admin@example.com');
    cy.get('[data-test="password"]').type('password123');
    cy.get('[data-test="login-button"]').click();
    cy.contains('Bienvenido, Admin').should('be.visible');
  });
  