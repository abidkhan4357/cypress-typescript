import { PageElements, WaitCondition } from '@types/test.types';
import { WaitHelper } from '@utils/wait.helper';
import { logger } from '@utils/logger';

export abstract class BasePage {
  protected abstract url: string;
  protected abstract elements: PageElements;
  protected pageTitle: string = '';

  constructor(pageTitle: string = '') {
    this.pageTitle = pageTitle;
  }

  visit(options?: Partial<Cypress.VisitOptions>): Cypress.Chainable {
    logger.pageAction(`Visiting page: ${this.pageTitle || this.url}`);
    return cy.visit(this.url, options);
  }

  waitForPageLoad(timeout?: number): Cypress.Chainable {
    logger.pageAction(`Waiting for page load: ${this.pageTitle}`);
    return WaitHelper.waitForPageLoad(timeout);
  }

  verifyPageLoaded(): Cypress.Chainable {
    logger.pageAction(`Verifying page loaded: ${this.pageTitle}`);
    
    if (this.pageTitle) {
      return cy.title().should('contain', this.pageTitle);
    }
    
    return cy.url().should('include', this.url);
  }

  getElement(elementKey: string): Cypress.Chainable {
    const element = this.elements[elementKey];
    
    if (!element) {
      throw new Error(`Element '${elementKey}' not found in page elements`);
    }
    
    const timeout = element.timeout || 10000;
    logger.pageAction(`Getting element: ${elementKey}`, element.selector);
    
    return cy.get(element.selector, { timeout });
  }

  waitForElement(elementKey: string, condition?: WaitCondition): Cypress.Chainable {
    const element = this.elements[elementKey];
    
    if (!element) {
      throw new Error(`Element '${elementKey}' not found in page elements`);
    }
    
    if (condition) {
      return WaitHelper.waitForCondition({
        ...condition,
        selector: element.selector
      });
    }
    
    return WaitHelper.waitForElement(element.selector, element.timeout);
  }

  click(elementKey: string, options?: Partial<Cypress.ClickOptions>): Cypress.Chainable {
    logger.pageAction(`Clicking element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('be.enabled')
      .click(options);
  }

  type(elementKey: string, text: string, options?: Partial<Cypress.TypeOptions>): Cypress.Chainable {
    logger.pageAction(`Typing into element: ${elementKey}`, text);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('be.enabled')
      .clear()
      .type(text, options);
  }

  select(elementKey: string, value: string): Cypress.Chainable {
    logger.pageAction(`Selecting value in element: ${elementKey}`, value);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('be.enabled')
      .select(value);
  }

  check(elementKey: string): Cypress.Chainable {
    logger.pageAction(`Checking element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('be.enabled')
      .check();
  }

  uncheck(elementKey: string): Cypress.Chainable {
    logger.pageAction(`Unchecking element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('be.enabled')
      .uncheck();
  }

  getText(elementKey: string): Cypress.Chainable<string> {
    logger.pageAction(`Getting text from element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .invoke('text')
      .then(text => text.trim());
  }

  getValue(elementKey: string): Cypress.Chainable<string> {
    logger.pageAction(`Getting value from element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .invoke('val')
      .then(val => String(val));
  }

  verifyText(elementKey: string, expectedText: string): Cypress.Chainable {
    logger.pageAction(`Verifying text in element: ${elementKey}`, expectedText);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('contain.text', expectedText);
  }

  verifyValue(elementKey: string, expectedValue: string): Cypress.Chainable {
    logger.pageAction(`Verifying value in element: ${elementKey}`, expectedValue);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('have.value', expectedValue);
  }

  isVisible(elementKey: string): Cypress.Chainable<boolean> {
    const element = this.elements[elementKey];
    
    if (!element) {
      throw new Error(`Element '${elementKey}' not found in page elements`);
    }
    
    return cy.get('body').then($body => {
      const elementExists = $body.find(element.selector).length > 0;
      return elementExists && $body.find(element.selector).is(':visible');
    });
  }

  isEnabled(elementKey: string): Cypress.Chainable<boolean> {
    return this.getElement(elementKey)
      .then($el => !$el.is(':disabled'));
  }

  scrollToElement(elementKey: string): Cypress.Chainable {
    logger.pageAction(`Scrolling to element: ${elementKey}`);
    
    return this.getElement(elementKey)
      .scrollIntoView();
  }

  uploadFile(elementKey: string, filePath: string): Cypress.Chainable {
    logger.pageAction(`Uploading file to element: ${elementKey}`, filePath);
    
    return this.getElement(elementKey)
      .selectFile(filePath);
  }

  dragAndDrop(sourceElementKey: string, targetElementKey: string): Cypress.Chainable {
    logger.pageAction(`Dragging ${sourceElementKey} to ${targetElementKey}`);
    
    return this.getElement(sourceElementKey)
      .drag(this.elements[targetElementKey].selector);
  }

  doubleClick(elementKey: string): Cypress.Chainable {
    logger.pageAction(`Double clicking element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .should('be.enabled')
      .dblclick();
  }

  rightClick(elementKey: string): Cypress.Chainable {
    logger.pageAction(`Right clicking element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .rightclick();
  }

  hover(elementKey: string): Cypress.Chainable {
    logger.pageAction(`Hovering over element: ${elementKey}`);
    
    return this.waitForElement(elementKey)
      .should('be.visible')
      .trigger('mouseover');
  }
}