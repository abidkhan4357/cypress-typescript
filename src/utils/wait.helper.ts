import { WaitCondition } from '@types/test.types';
import { logger } from './logger';

export class WaitHelper {
  private static readonly DEFAULT_TIMEOUT = 10000;
  private static readonly DEFAULT_INTERVAL = 500;

  static waitForCondition(condition: WaitCondition): Cypress.Chainable {
    const timeout = condition.timeout || this.DEFAULT_TIMEOUT;
    
    logger.debug(`Waiting for condition: ${condition.type}`, condition);
    
    switch (condition.type) {
      case 'visible':
        return cy.get(condition.selector!, { timeout }).should('be.visible');
      
      case 'hidden':
        return cy.get(condition.selector!, { timeout }).should('not.be.visible');
      
      case 'enabled':
        return cy.get(condition.selector!, { timeout }).should('be.enabled');
      
      case 'disabled':
        return cy.get(condition.selector!, { timeout }).should('be.disabled');
      
      case 'exist':
        return cy.get(condition.selector!, { timeout }).should('exist');
      
      case 'not.exist':
        return cy.get(condition.selector!, { timeout }).should('not.exist');
      
      case 'contain':
        return cy.get(condition.selector!, { timeout }).should('contain.text', condition.text!);
      
      case 'have.value':
        return cy.get(condition.selector!, { timeout }).should('have.value', condition.value!);
      
      default:
        throw new Error(`Unsupported wait condition: ${condition.type}`);
    }
  }

  static waitForElement(selector: string, timeout?: number): Cypress.Chainable {
    return this.waitForCondition({
      type: 'visible',
      selector,
      timeout
    });
  }

  static waitForElementToDisappear(selector: string, timeout?: number): Cypress.Chainable {
    return this.waitForCondition({
      type: 'not.exist',
      selector,
      timeout
    });
  }

  static waitForText(selector: string, text: string, timeout?: number): Cypress.Chainable {
    return this.waitForCondition({
      type: 'contain',
      selector,
      text,
      timeout
    });
  }

  static waitForValue(selector: string, value: string, timeout?: number): Cypress.Chainable {
    return this.waitForCondition({
      type: 'have.value',
      selector,
      value,
      timeout
    });
  }

  static waitForPageLoad(timeout?: number): Cypress.Chainable {
    const pageLoadTimeout = timeout || 30000;
    
    return cy.window({ timeout: pageLoadTimeout }).then((win) => {
      return new Cypress.Promise((resolve) => {
        if (win.document.readyState === 'complete') {
          resolve();
        } else {
          win.addEventListener('load', resolve);
        }
      });
    });
  }

  static waitForApiResponse(alias: string, timeout?: number): Cypress.Chainable {
    return cy.wait(alias, { timeout: timeout || 15000 });
  }

  static waitForMultipleElements(selectors: string[], timeout?: number): Cypress.Chainable {
    const promises = selectors.map(selector => 
      this.waitForElement(selector, timeout)
    );
    
    return cy.wrap(Promise.all(promises));
  }

  static waitForAnyElement(selectors: string[], timeout?: number): Cypress.Chainable {
    const waitTimeout = timeout || this.DEFAULT_TIMEOUT;
    const startTime = Date.now();
    
    const checkElements = (): Cypress.Chainable => {
      for (const selector of selectors) {
        if (Date.now() - startTime > waitTimeout) {
          throw new Error(`None of the elements were found within ${waitTimeout}ms: ${selectors.join(', ')}`);
        }
        
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            return cy.get(selector);
          }
        });
      }
      
      return cy.wait(this.DEFAULT_INTERVAL).then(checkElements);
    };
    
    return checkElements();
  }

  static waitForStableElement(selector: string, timeout?: number): Cypress.Chainable {
    const stableTimeout = timeout || 2000;
    
    return cy.get(selector)
      .should('be.visible')
      .then($el => {
        const initialRect = $el[0].getBoundingClientRect();
        
        cy.wait(stableTimeout).then(() => {
          const finalRect = $el[0].getBoundingClientRect();
          
          if (initialRect.top !== finalRect.top || 
              initialRect.left !== finalRect.left ||
              initialRect.width !== finalRect.width ||
              initialRect.height !== finalRect.height) {
            throw new Error(`Element ${selector} is not stable`);
          }
        });
        
        return cy.wrap($el);
      });
  }
}