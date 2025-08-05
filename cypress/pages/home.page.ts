export class HomePage {
  private static instance: HomePage;

  static getInstance(): HomePage {
    if (!HomePage.instance) {
      HomePage.instance = new HomePage();
    }
    return HomePage.instance;
  }

  // Selectors
  private get logoutLink() { return 'a:contains("Logout")'; }

  // Actions
  isLogoutVisible(options?: { timeout?: number }): Cypress.Chainable<boolean> {
    const timeout = options?.timeout || 10000;
    return cy.get(this.logoutLink, { timeout }).should('be.visible').then(() => true);
  }
}

export const homePage = HomePage.getInstance();