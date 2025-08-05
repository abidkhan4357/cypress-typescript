/// <reference types="cypress" />

// Essential UI commands for Cypress tests
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      // Basic navigation
      visitPage(url: string): Chainable<void>;
      
      // Wait utilities
      waitForPageLoad(): Chainable<void>;
      
      // Form helpers
      fillForm(selector: string, value: string): Chainable<void>;
      clickButton(selector: string): Chainable<void>;
      
      // Assertions
      shouldBeVisible(selector: string): Chainable<JQuery<HTMLElement>>;
      shouldContainText(selector: string, text: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Basic navigation command
Cypress.Commands.add('visitPage', (url: string) => {
  cy.visit(url);
  cy.waitForPageLoad();
});

// Wait for page to fully load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.document().should('have.property', 'readyState', 'complete');
  cy.get('body').should('be.visible');
});

// Fill form field helper
Cypress.Commands.add('fillForm', (selector: string, value: string) => {
  cy.get(selector).clear().type(value);
});

// Click button helper
Cypress.Commands.add('clickButton', (selector: string) => {
  cy.get(selector).should('be.visible').should('be.enabled').click();
});

// Assertion helpers
Cypress.Commands.add('shouldBeVisible', (selector: string) => {
  return cy.get(selector).should('be.visible');
});

Cypress.Commands.add('shouldContainText', (selector: string, text: string) => {
  return cy.get(selector).should('contain.text', text);
});