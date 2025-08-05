import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  private selectors = {
    // Address sections
    deliveryAddress: '.checkout-information .address_details:first',
    billingAddress: '.checkout-information .address_details:last',
    
    // Order review
    orderReview: '.checkout-information .review-payment',
    reviewTable: '#cart_info_table',
    reviewItems: '#cart_info_table tbody tr',
    
    // Comment section
    commentTextarea: 'textarea[name="message"]',
    
    // Place order
    placeOrderBtn: '.btn-default:contains("Place Order")',
    
    // Payment form
    nameOnCard: '[data-qa="name-on-card"]',
    cardNumber: '[data-qa="card-number"]',
    cvc: '[data-qa="cvc"]',
    expiryMonth: '[data-qa="expiry-month"]',
    expiryYear: '[data-qa="expiry-year"]',
    payButton: '[data-qa="pay-button"]',
    
    // Order confirmation
    orderPlacedMessage: '[data-qa="order-placed"]',
    continueButton: '[data-qa="continue-button"]',
    downloadInvoiceBtn: '.btn-default:contains("Download Invoice")'
  };

  verifyCheckoutPageLoaded(): void {
    cy.get(this.selectors.deliveryAddress).should('be.visible');
    cy.get(this.selectors.billingAddress).should('be.visible');
    cy.get(this.selectors.orderReview).should('be.visible');
    this.logger.pageAction('Verified checkout page loaded');
  }

  verifyDeliveryAddress(address: any): void {
    cy.get(this.selectors.deliveryAddress).within(() => {
      cy.should('contain.text', address.firstName);
      cy.should('contain.text', address.lastName);
      cy.should('contain.text', address.address1);
      cy.should('contain.text', address.city);
      cy.should('contain.text', address.state);
      cy.should('contain.text', address.zipcode);
    });
    this.logger.pageAction('Verified delivery address');
  }

  verifyBillingAddress(address: any): void {
    cy.get(this.selectors.billingAddress).within(() => {
      cy.should('contain.text', address.firstName);
      cy.should('contain.text', address.lastName);
      cy.should('contain.text', address.address1);
      cy.should('contain.text', address.city);
      cy.should('contain.text', address.state);
      cy.should('contain.text', address.zipcode);
    });
    this.logger.pageAction('Verified billing address');
  }

  verifyOrderReview(): void {
    cy.get(this.selectors.reviewTable).should('be.visible');
    cy.get(this.selectors.reviewItems).should('have.length.greaterThan', 0);
    this.logger.pageAction('Verified order review section');
  }

  addOrderComment(comment: string): void {
    cy.get(this.selectors.commentTextarea).clear().type(comment);
    this.logger.pageAction(`Added order comment: ${comment}`);
  }

  placeOrder(): void {
    cy.get(this.selectors.placeOrderBtn).click();
    this.logger.pageAction('Clicked place order button');
  }

  fillPaymentDetails(paymentInfo: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): void {
    cy.get(this.selectors.nameOnCard).clear().type(paymentInfo.nameOnCard);
    cy.get(this.selectors.cardNumber).clear().type(paymentInfo.cardNumber);
    cy.get(this.selectors.cvc).clear().type(paymentInfo.cvc);
    cy.get(this.selectors.expiryMonth).clear().type(paymentInfo.expiryMonth);
    cy.get(this.selectors.expiryYear).clear().type(paymentInfo.expiryYear);
    
    this.logger.pageAction('Filled payment details');
  }

  submitPayment(): void {
    cy.get(this.selectors.payButton).click();
    this.logger.pageAction('Submitted payment');
  }

  verifyOrderPlaced(): void {
    cy.get(this.selectors.orderPlacedMessage).should('be.visible');
    cy.get(this.selectors.orderPlacedMessage).should('contain.text', 'Order Placed!');
    this.logger.pageAction('Verified order placed successfully');
  }

  verifyOrderConfirmationPage(): void {
    this.verifyOrderPlaced();
    cy.get(this.selectors.continueButton).should('be.visible');
    cy.get(this.selectors.downloadInvoiceBtn).should('be.visible');
    this.logger.pageAction('Verified order confirmation page');
  }

  downloadInvoice(): void {
    cy.get(this.selectors.downloadInvoiceBtn).click();
    this.logger.pageAction('Downloaded invoice');
  }

  continueAfterOrder(): void {
    cy.get(this.selectors.continueButton).click();
    this.logger.pageAction('Clicked continue after order');
  }

  completeCheckout(comment: string, paymentInfo: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }): void {
    this.verifyCheckoutPageLoaded();
    this.verifyOrderReview();
    this.addOrderComment(comment);
    this.placeOrder();
    
    this.fillPaymentDetails(paymentInfo);
    this.submitPayment();
    
    this.verifyOrderPlaced();
    this.logger.pageAction('Completed full checkout process');
  }

  getOrderTotal(): Cypress.Chainable<string> {
    return cy.get(this.selectors.reviewTable)
      .find('.cart_total_price')
      .last()
      .invoke('text');
  }

  verifyOrderItems(expectedItems: string[]): void {
    expectedItems.forEach(item => {
      cy.get(this.selectors.reviewItems).should('contain.text', item);
    });
    this.logger.pageAction(`Verified order contains items: ${expectedItems.join(', ')}`);
  }
}