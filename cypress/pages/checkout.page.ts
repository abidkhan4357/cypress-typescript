import { UserData } from '../../data/user-factory';

export class CheckoutPage {
  private static instance: CheckoutPage;

  static getInstance(): CheckoutPage {
    if (!CheckoutPage.instance) {
      CheckoutPage.instance = new CheckoutPage();
    }
    return CheckoutPage.instance;
  }

  // Selectors
  private get addressDetailsSection() { return '#address_delivery'; }
  private get orderProductNames() { return '.cart_description h4 a'; }
  private get placeOrderButton() { return 'a.check_out, .btn.btn-default.check_out'; }
  private get commentTextarea() { return 'textarea[name="message"]'; }

  // Actions
  isOnCheckoutPage(): Cypress.Chainable<boolean> {
    return cy.get(this.addressDetailsSection).should('be.visible').then(() => true);
  }

  addOrderComment(comment: string): void {
    cy.get(this.commentTextarea).type(comment);
  }

  placeOrder(): void {
    cy.get(this.placeOrderButton).click();
  }

  continueToPayment(): void {
    this.placeOrder();
  }

  clickRegisterLogin(): void {
    cy.get(this.registerLoginLink).click();
  }

  // Validations
  verifyCheckoutPageLoaded(): void {
    cy.url().should('include', '/checkout');
    cy.get(this.addressDetailsSection).should('be.visible');
    cy.get(this.orderReviewSection).should('be.visible');
  }

  verifyDeliveryAddress(user: UserData): void {
    cy.get(this.addressDetailsSection).within(() => {
      cy.contains(`${user.title}. ${user.firstname} ${user.lastname}`).should('be.visible');
      cy.contains(user.company).should('be.visible');
      cy.contains(user.address1).should('be.visible');
      if (user.address2) {
        cy.contains(user.address2).should('be.visible');
      }
      cy.contains(`${user.city} ${user.state} ${user.zipcode}`).should('be.visible');
      cy.contains(user.country).should('be.visible');
      cy.contains(user.mobile_number).should('be.visible');
    });
  }

  verifyBillingAddress(user: UserData): void {
    cy.get(this.billingAddressSection).within(() => {
      cy.contains(`${user.title}. ${user.firstname} ${user.lastname}`).should('be.visible');
      cy.contains(user.company).should('be.visible');
      cy.contains(user.address1).should('be.visible');
      if (user.address2) {
        cy.contains(user.address2).should('be.visible');
      }
      cy.contains(`${user.city} ${user.state} ${user.zipcode}`).should('be.visible');
      cy.contains(user.country).should('be.visible');
      cy.contains(user.mobile_number).should('be.visible');
    });
  }

  verifyOrderReview(): void {
    cy.get(this.cartItems).should('have.length.greaterThan', 0);
    cy.get(this.totalAmount).should('be.visible');
  }

  verifyCartItemInCheckout(productName: string, price: string, quantity: string): void {
    cy.get(this.cartItems).within(() => {
      cy.contains(productName).should('be.visible');
      cy.contains(price).should('be.visible');
      cy.contains(quantity).should('be.visible');
    });
  }

  verifyTotalAmount(expectedTotal: string): void {
    cy.get(this.totalAmount).should('contain.text', expectedTotal);
  }

  verifyLoginRequiredMessage(): void {
    cy.get('.modal-body').should('contain.text', 'Register / Login account to proceed');
    cy.get(this.registerLoginLink).should('be.visible');
  }

  // Advanced methods
  completeCheckoutFlow(user: UserData, comment?: string): void {
    this.verifyCheckoutPageLoaded();
    this.verifyDeliveryAddress(user);
    this.verifyBillingAddress(user);
    this.verifyOrderReview();
    
    if (comment) {
      this.addOrderComment(comment);
    }
    
    this.placeOrder();
  }

  verifyCheckoutWithMultipleItems(items: Array<{ name: string; price: string; quantity: string }>): void {
    this.verifyCheckoutPageLoaded();
    
    items.forEach(item => {
      this.verifyCartItemInCheckout(item.name, item.price, item.quantity);
    });
    
    this.verifyOrderReview();
  }

  proceedAsGuestUser(): void {
    // If register/login modal appears, handle it
    cy.get('body').then(($body) => {
      if ($body.find('.modal-body').length > 0) {
        this.clickRegisterLogin();
      }
    });
  }

  // Utility methods
  getCartItemsCount(): Cypress.Chainable<number> {
    return cy.get(this.cartItems).then(($items) => {
      return $items.length;
    });
  }

  getTotalAmount(): Cypress.Chainable<string> {
    return cy.get(this.totalAmount).invoke('text').then((text) => {
      return text.trim();
    });
  }

  isCheckoutEnabled(): Cypress.Chainable<boolean> {
    return cy.get(this.placeOrderButton).then(($button) => {
      return !$button.prop('disabled') && $button.is(':visible');
    });
  }

  getOrderComment(): Cypress.Chainable<string> {
    return cy.get(this.commentTextarea).invoke('val').then((val) => {
      return val?.toString() || '';
    });
  }
}

export const checkoutPage = CheckoutPage.getInstance();