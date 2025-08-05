import { BasePage } from './base.page';
import { PageElements } from '@types/test.types';
import { LoginCredentials, UserRegistrationData } from '@types/user.types';
import { logger } from '@utils/logger';

export class LoginPage extends BasePage {
  protected url = '/login';
  protected pageTitle = 'Automation Exercise - Signup / Login';

  protected elements: PageElements = {
    // Login section
    loginTitle: {
      selector: '.login-form h2',
      description: 'Login to your account title',
      type: 'text',
      required: true
    },
    loginEmail: {
      selector: 'input[data-qa="login-email"]',
      description: 'Login email input',
      type: 'input',
      required: true
    },
    loginPassword: {
      selector: 'input[data-qa="login-password"]',
      description: 'Login password input',
      type: 'input',
      required: true
    },
    loginButton: {
      selector: 'button[data-qa="login-button"]',
      description: 'Login button',
      type: 'button',
      required: true
    },
    loginError: {
      selector: '.login-form p[style*="color: red"]',
      description: 'Login error message',
      type: 'text',
      required: false
    },

    // Signup section
    signupTitle: {
      selector: '.signup-form h2',
      description: 'New User Signup title',
      type: 'text',
      required: true
    },
    signupName: {
      selector: 'input[data-qa="signup-name"]',
      description: 'Signup name input',
      type: 'input',
      required: true
    },
    signupEmail: {
      selector: 'input[data-qa="signup-email"]',
      description: 'Signup email input',
      type: 'input',
      required: true
    },
    signupButton: {
      selector: 'button[data-qa="signup-button"]',
      description: 'Signup button',
      type: 'button',
      required: true
    },
    signupError: {
      selector: '.signup-form p[style*="color: red"]',
      description: 'Signup error message',
      type: 'text',
      required: false
    }
  };

  login(credentials: LoginCredentials): Cypress.Chainable {
    logger.step(`Login with email: ${credentials.email}`);
    
    return this.waitForElement('loginEmail')
      .then(() => this.type('loginEmail', credentials.email))
      .then(() => this.type('loginPassword', credentials.password))
      .then(() => this.click('loginButton'));
  }

  signup(userData: Partial<UserRegistrationData>): Cypress.Chainable {
    logger.step(`Signup with name: ${userData.name}, email: ${userData.email}`);
    
    if (!userData.name || !userData.email) {
      throw new Error('Name and email are required for signup');
    }
    
    return this.waitForElement('signupName')
      .then(() => this.type('signupName', userData.name))
      .then(() => this.type('signupEmail', userData.email))
      .then(() => this.click('signupButton'));
  }

  verifyLoginPageLoaded(): Cypress.Chainable {
    logger.step('Verify login page is loaded');
    
    return this.verifyPageLoaded()
      .then(() => this.waitForElement('loginTitle'))
      .then(() => this.waitForElement('signupTitle'))
      .then(() => this.verifyText('loginTitle', 'Login to your account'))
      .then(() => this.verifyText('signupTitle', 'New User Signup!'));
  }

  verifyLoginError(expectedError?: string): Cypress.Chainable {
    logger.step('Verify login error message');
    
    const errorElement = this.waitForElement('loginError');
    
    if (expectedError) {
      return errorElement.then(() => this.verifyText('loginError', expectedError));
    }
    
    return errorElement.should('be.visible');
  }

  verifySignupError(expectedError?: string): Cypress.Chainable {
    logger.step('Verify signup error message');
    
    const errorElement = this.waitForElement('signupError');
    
    if (expectedError) {
      return errorElement.then(() => this.verifyText('signupError', expectedError));
    }
    
    return errorElement.should('be.visible');
  }

  clearLoginForm(): Cypress.Chainable {
    logger.step('Clear login form');
    
    return this.getElement('loginEmail')
      .clear()
      .then(() => this.getElement('loginPassword').clear());
  }

  clearSignupForm(): Cypress.Chainable {
    logger.step('Clear signup form');
    
    return this.getElement('signupName')
      .clear()
      .then(() => this.getElement('signupEmail').clear());
  }

  isLoginFormVisible(): Cypress.Chainable<boolean> {
    return this.isVisible('loginTitle');
  }

  isSignupFormVisible(): Cypress.Chainable<boolean> {
    return this.isVisible('signupTitle');
  }

  getLoginErrorMessage(): Cypress.Chainable<string> {
    return this.getText('loginError');
  }

  getSignupErrorMessage(): Cypress.Chainable<string> {
    return this.getText('signupError');
  }

  verifySuccessfulLogin(): Cypress.Chainable {
    logger.step('Verify successful login redirect');
    
    // After successful login, user should be redirected to account page
    return cy.url()
      .should('not.include', '/login')
      .then(() => {
        // Check for logged in user indicator
        return cy.get('a[href="/logout"]').should('be.visible');
      });
  }

  verifySuccessfulSignupRedirect(): Cypress.Chainable {
    logger.step('Verify successful signup redirect');
    
    // After successful signup, user should be redirected to signup details page
    return cy.url().should('include', '/signup');
  }

  tryLoginWithEmptyFields(): Cypress.Chainable {
    logger.step('Try login with empty fields');
    
    return this.clearLoginForm()
      .then(() => this.click('loginButton'));
  }

  trySignupWithEmptyFields(): Cypress.Chainable {
    logger.step('Try signup with empty fields');
    
    return this.clearSignupForm()
      .then(() => this.click('signupButton'));
  }

  loginAndExpectError(credentials: LoginCredentials, expectedError: string): Cypress.Chainable {
    logger.step(`Login with invalid credentials and expect error: ${expectedError}`);
    
    return this.login(credentials)
      .then(() => this.verifyLoginError(expectedError));
  }

  signupAndExpectError(userData: Partial<UserRegistrationData>, expectedError: string): Cypress.Chainable {
    logger.step(`Signup with invalid data and expect error: ${expectedError}`);
    
    return this.signup(userData)
      .then(() => this.verifySignupError(expectedError));
  }
}