export class OrderConfirmationPage {
  private static instance: OrderConfirmationPage;

  static getInstance(): OrderConfirmationPage {
    if (!OrderConfirmationPage.instance) {
      OrderConfirmationPage.instance = new OrderConfirmationPage();
    }
    return OrderConfirmationPage.instance;
  }

  // Selectors
  private get orderSuccessMessage() { return 'h2.title[data-qa="order-placed"]'; }

  // Actions
  assertOrderPlacedSuccessfully(): void {
    cy.get(this.orderSuccessMessage).should('be.visible');
    cy.get(this.orderSuccessMessage).should('contain.text', 'Order Placed!');
  }
}

export const orderConfirmationPage = OrderConfirmationPage.getInstance();