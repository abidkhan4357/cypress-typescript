import { BasePage } from './base.page';
import { PageElements } from '@types/test.types';
import { logger } from '@utils/logger';

export class HomePage extends BasePage {
  protected url = '/';
  protected pageTitle = 'Automation Exercise';

  protected elements: PageElements = {
    logo: {
      selector: 'img[alt="Website for automation practice"]',
      description: 'Main logo',
      type: 'image',
      required: true
    },
    signupLoginLink: {
      selector: 'a[href="/login"]',
      description: 'Signup / Login link',
      type: 'link',
      required: true
    },
    productsLink: {
      selector: 'a[href="/products"]',
      description: 'Products link',
      type: 'link',
      required: true
    },
    cartLink: {
      selector: 'a[href="/view_cart"]',
      description: 'Cart link',
      type: 'link',
      required: true
    },
    contactUsLink: {
      selector: 'a[href="/contact_us"]',
      description: 'Contact us link',
      type: 'link',
      required: true
    },
    testCasesLink: {
      selector: 'a[href="/test_cases"]',
      description: 'Test Cases link',
      type: 'link',
      required: true
    },
    apiTestingLink: {
      selector: 'a[href="/api_list"]',
      description: 'API Testing link',
      type: 'link',
      required: true
    },
    videoTutorialsLink: {
      selector: 'a[href="https://www.youtube.com/c/AutomationExercise"]',
      description: 'Video Tutorials link',
      type: 'link',
      required: false
    },
    subscriptionEmail: {
      selector: '#susbscribe_email',
      description: 'Subscription email input',
      type: 'input',
      required: false
    },
    subscriptionButton: {
      selector: '#subscribe',
      description: 'Subscribe button',
      type: 'button',
      required: false
    },
    subscriptionAlert: {
      selector: '.alert-success',
      description: 'Subscription success alert',
      type: 'text',
      required: false
    },
    scrollUpArrow: {
      selector: '#scrollUp',
      description: 'Scroll up arrow',
      type: 'button',
      required: false
    },
    featuredItems: {
      selector: '.features_items .product-image-wrapper',
      description: 'Featured items section',
      type: 'text',
      required: true
    },
    categoryPanel: {
      selector: '.category-products',
      description: 'Category panel',
      type: 'text',
      required: true
    },
    recommendedItems: {
      selector: '.recommended_items',
      description: 'Recommended items carousel',
      type: 'text',
      required: false
    }
  };

  navigateToSignupLogin(): Cypress.Chainable {
    logger.step('Navigate to Signup/Login page');
    return this.click('signupLoginLink');
  }

  navigateToProducts(): Cypress.Chainable {
    logger.step('Navigate to Products page');
    return this.click('productsLink');
  }

  navigateToCart(): Cypress.Chainable {
    logger.step('Navigate to Cart page');
    return this.click('cartLink');
  }

  navigateToContactUs(): Cypress.Chainable {
    logger.step('Navigate to Contact Us page');
    return this.click('contactUsLink');
  }

  navigateToTestCases(): Cypress.Chainable {
    logger.step('Navigate to Test Cases page');
    return this.click('testCasesLink');
  }

  navigateToApiTesting(): Cypress.Chainable {
    logger.step('Navigate to API Testing page');
    return this.click('apiTestingLink');
  }

  subscribeToNewsletter(email: string): Cypress.Chainable {
    logger.step(`Subscribe to newsletter with email: ${email}`);
    
    return this.scrollToElement('subscriptionEmail')
      .then(() => this.type('subscriptionEmail', email))
      .then(() => this.click('subscriptionButton'))
      .then(() => this.waitForElement('subscriptionAlert'))
      .then(() => this.verifyText('subscriptionAlert', 'You have been successfully subscribed!'));
  }

  verifyHomePageLoaded(): Cypress.Chainable {
    logger.step('Verify home page is loaded');
    
    return this.verifyPageLoaded()
      .then(() => this.waitForElement('logo'))
      .then(() => this.waitForElement('featuredItems'))
      .then(() => this.verifyText('featuredItems', ''));
  }

  scrollToTop(): Cypress.Chainable {
    logger.step('Scroll to top of page');
    return this.click('scrollUpArrow');
  }

  getFeaturedProducts(): Cypress.Chainable<string[]> {
    logger.step('Get featured products list');
    
    return this.waitForElement('featuredItems')
      .find('.productinfo h2')
      .then($products => {
        const productNames: string[] = [];
        $products.each((index, element) => {
          productNames.push(Cypress.$(element).text().trim());
        });
        return productNames;
      });
  }

  clickFeaturedProduct(productIndex: number): Cypress.Chainable {
    logger.step(`Click featured product at index: ${productIndex}`);
    
    return this.waitForElement('featuredItems')
      .find('.productinfo')
      .eq(productIndex)
      .find('a[data-product-id]')
      .click();
  }

  addFeaturedProductToCart(productIndex: number): Cypress.Chainable {
    logger.step(`Add featured product ${productIndex} to cart`);
    
    return this.waitForElement('featuredItems')
      .find('.productinfo')
      .eq(productIndex)
      .find('.add-to-cart')
      .click();
  }

  verifyProductAddedModal(): Cypress.Chainable {
    logger.step('Verify product added to cart modal');
    
    return cy.get('.modal-content')
      .should('be.visible')
      .should('contain.text', 'Added!');
  }

  continueShoppingFromModal(): Cypress.Chainable {
    logger.step('Continue shopping from modal');
    
    return cy.get('.modal-content')
      .find('button[data-dismiss="modal"]')
      .click();
  }

  viewCartFromModal(): Cypress.Chainable {
    logger.step('View cart from modal');
    
    return cy.get('.modal-content')
      .find('a[href="/view_cart"]')
      .click();
  }
}