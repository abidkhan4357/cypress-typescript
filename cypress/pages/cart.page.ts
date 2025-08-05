export class CartPage {
  private static instance: CartPage;

  static getInstance(): CartPage {
    if (!CartPage.instance) {
      CartPage.instance = new CartPage();
    }
    return CartPage.instance;
  }

  // Selectors
  private get cartItems() { return 'table#cart_info_table tbody tr[id^="product-"]'; }
  private get productNamesInCart() { return '.cart_description h4 a'; }
  private get checkoutButton() { return '.check_out'; }

  // Actions
  getCartItemCount(): Cypress.Chainable<number> {
    return cy.get('#cart_info_table tbody tr').then(($rows) => {
      return $rows.length;
    });
  }

  proceedToCheckout(): void {
    cy.get(this.checkoutButton).click();
  }
}

export const cartPage = CartPage.getInstance();