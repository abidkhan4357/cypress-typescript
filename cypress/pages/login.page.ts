import { LoginCredentials } from '../../data/user-factory';

export class LoginPage {
  private static instance: LoginPage;

  static getInstance(): LoginPage {
    if (!LoginPage.instance) {
      LoginPage.instance = new LoginPage();
    }
    return LoginPage.instance;
  }

  // Selectors
  private get loginEmailInput() { return 'input[data-qa="login-email"]'; }
  private get loginPasswordInput() { return 'input[data-qa="login-password"]'; }
  private get loginButton() { return '[data-qa="login-button"]'; }
  private get credentialsErrorMessage() { return 'p[style*="color: red"]'; }
  private get loggedInAsText() { return 'a:contains("Logged in as")'; }

  // Actions
  navigateToLoginPage(): void {
    cy.visit('/login');
  }

  login(email: string, password: string): void {
    if (email) {
      cy.get(this.loginEmailInput).clear().type(email);
    } else {
      cy.get(this.loginEmailInput).clear();
    }
    
    if (password) {
      cy.get(this.loginPasswordInput).clear().type(password);
    } else {
      cy.get(this.loginPasswordInput).clear();
    }
    
    cy.get(this.loginButton).click();
  }

  assertInvalidCredentialsError(): void {
    cy.get(this.credentialsErrorMessage).should('be.visible');
  }

  getLoggedInAsText(): Cypress.Chainable<string> {
    return cy.get(this.loggedInAsText).invoke('text');
  }
}

export const loginPage = LoginPage.getInstance();