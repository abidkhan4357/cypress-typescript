// Import commands
import './commands';

// Import custom commands for real events
import 'cypress-real-events/support';

// Import code coverage support
import '@cypress/code-coverage/support';

// Import logger
import { logger } from '@utils/logger';

// Essential imports only

// Global configuration
before(() => {
  logger.info('Starting Cypress test suite');
  
  // Setup global test environment
  cy.clearCookies();
  cy.clearLocalStorage();
  
  // Set default viewport if not already set
  if (!Cypress.config('viewportWidth')) {
    cy.viewport(1920, 1080);
  }
  
  // Basic setup complete
});

beforeEach(() => {
  // Clear browser state before each test
  cy.clearCookies();
  cy.clearLocalStorage();
  
  // Reset viewport
  cy.viewport(1920, 1080);
  
  // Add test context logging
  cy.log(`Running test: ${Cypress.currentTest.title}`);
  logger.testStart(Cypress.currentTest.title);
});

afterEach(() => {
  // Take screenshot on failure
  if (Cypress.currentTest.state === 'failed') {
    const testName = Cypress.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
    cy.takeScreenshotWithName(`failed_${testName}`);
    logger.testEnd(Cypress.currentTest.title, 'failed');
  } else {
    logger.testEnd(Cypress.currentTest.title, 'passed');
  }
  
  // Clean up any test data
  cy.clearCookies();
  cy.clearLocalStorage();
});

after(() => {
  logger.info('Cypress test suite completed');
});

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error but don't fail the test for certain types of errors
  logger.error('Uncaught exception in test', err);
  
  // Ignore React dev tools errors
  if (err.message.includes('React DevTools')) {
    return false;
  }
  
  // Ignore network errors that don't affect functionality
  if (err.message.includes('Network Error') || err.message.includes('ERR_NETWORK')) {
    return false;
  }
  
  // Ignore ResizeObserver errors (common in modern web apps)
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  
  // Let other errors fail the test
  return true;
});

// Custom command to handle React app hydration
Cypress.Commands.add('waitForReactApp', () => {
  cy.window().should('have.property', '__REACT_DEVTOOLS_GLOBAL_HOOK__');
});

// Command to wait for all images to load
Cypress.Commands.add('waitForImages', () => {
  cy.get('img').should(($images) => {
    $images.each((index, img) => {
      expect(img.complete).to.be.true;
    });
  });
});

// Command to simulate slow network conditions
Cypress.Commands.add('simulateSlowNetwork', () => {
  cy.intercept('*', (req) => {
    req.reply((res) => {
      // Add 2 second delay to all requests
      return new Promise((resolve) => {
        setTimeout(() => resolve(res), 2000);
      });
    });
  });
});

// Command to bypass CORS issues
Cypress.Commands.add('bypassCors', () => {
  cy.window().then((win) => {
    win.fetch = new Proxy(win.fetch, {
      apply(target, thisArg, argumentsList) {
        const [resource, config = {}] = argumentsList;
        config.mode = 'cors';
        config.credentials = 'include';
        return Reflect.apply(target, thisArg, [resource, config]);
      }
    });
  });
});

// Command to mock API responses
Cypress.Commands.add('mockApiResponse', (endpoint: string, response: any, statusCode = 200) => {
  cy.intercept('GET', `**${endpoint}`, {
    statusCode,
    body: response
  }).as(`mock${endpoint.replace(/[^a-zA-Z0-9]/g, '')}`);
});

// Command to generate and set authentication token
Cypress.Commands.add('setAuthToken', (token?: string) => {
  const authToken = token || 'mock-jwt-token-' + Date.now();
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', authToken);
    win.localStorage.setItem('isAuthenticated', 'true');
  });
});

// Command to verify accessibility
Cypress.Commands.add('checkA11y', () => {
  // Basic accessibility checks
  cy.get('img').should('have.attr', 'alt');
  cy.get('input').should('have.attr', 'aria-label').or('have.attr', 'placeholder');
  cy.get('button').should('not.be.empty');
});

// Command to test responsive design
Cypress.Commands.add('testResponsive', () => {
  const viewports = [
    { width: 320, height: 568 },   // Mobile
    { width: 768, height: 1024 },  // Tablet
    { width: 1024, height: 768 },  // Desktop
    { width: 1920, height: 1080 }  // Large Desktop
  ];
  
  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height);
    cy.wait(500); // Allow time for responsive changes
    cy.get('body').should('be.visible');
  });
});

// Command to simulate user interactions more realistically
Cypress.Commands.add('humanType', (selector: string, text: string) => {
  cy.get(selector).focus();
  
  // Type with realistic delays
  for (let i = 0; i < text.length; i++) {
    cy.get(selector).type(text[i], { delay: Math.random() * 100 + 50 });
  }
});

// Command to validate form field errors
Cypress.Commands.add('validateFieldError', (fieldSelector: string, errorSelector: string, expectedError: string) => {
  cy.get(fieldSelector).focus().blur();
  cy.get(errorSelector).should('be.visible').should('contain.text', expectedError);
});

// Add TypeScript support for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      waitForReactApp(): Chainable<void>;
      waitForImages(): Chainable<void>;
      simulateSlowNetwork(): Chainable<void>;
      bypassCors(): Chainable<void>;
      mockApiResponse(endpoint: string, response: any, statusCode?: number): Chainable<void>;
      setAuthToken(token?: string): Chainable<void>;
      checkA11y(): Chainable<void>;
      testResponsive(): Chainable<void>;
      humanType(selector: string, text: string): Chainable<void>;
      validateFieldError(fieldSelector: string, errorSelector: string, expectedError: string): Chainable<void>;
    }
  }
}