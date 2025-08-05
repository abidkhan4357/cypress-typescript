import { BasePage } from './base.page';

export class CartPage extends BasePage {
  private selectors = {
    cartTable: '#cart_info_table',
    cartItems: '#cart_info_table tbody tr',
    proceedToCheckoutBtn: '.btn-default:contains("Proceed To Checkout")',
    continueShoppingBtn: '.btn-success:contains("Continue Shopping")',
    emptyCartMessage: '.text-center',
    deleteItemBtn: '.cart_quantity_delete',
    quantityInput: '.cart_quantity .disabled',
    itemDescription: '.cart_description h4 a',
    itemPrice: '.cart_price p',
    totalPrice: '.cart_total_price'
  };

  visitCart(): void {
    cy.visit('/view_cart');
    this.waitForPageLoad();
    this.logger.pageAction('Visited cart page');
  }

  verifyCartPageLoaded(): void {
    cy.get(this.selectors.cartTable).should('be.visible');
    this.logger.pageAction('Verified cart page loaded');
  }

  getCartItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.cartItems);
  }

  getCartItemsCount(): Cypress.Chainable<number> {
    return this.getCartItems().then($items => $items.length);
  }

  verifyCartIsEmpty(): void {
    this.getCartItems().should('have.length', 0);
    cy.get(this.selectors.emptyCartMessage).should('contain.text', 'Cart is empty!');
    this.logger.pageAction('Verified cart is empty');
  }

  verifyCartHasItems(expectedCount?: number): void {
    if (expectedCount) {
      this.getCartItems().should('have.length', expectedCount);
    } else {
      this.getCartItems().should('have.length.greaterThan', 0);
    }
    this.logger.pageAction(`Verified cart has ${expectedCount || 'some'} items`);
  }

  removeItemFromCart(itemIndex: number = 0): void {
    this.getCartItems().eq(itemIndex).within(() => {
      cy.get(this.selectors.deleteItemBtn).click();
    });
    this.logger.pageAction(`Removed item ${itemIndex} from cart`);
  }

  getItemQuantity(itemIndex: number = 0): Cypress.Chainable<string> {
    return this.getCartItems().eq(itemIndex).find(this.selectors.quantityInput).invoke('text');
  }

  getItemName(itemIndex: number = 0): Cypress.Chainable<string> {
    return this.getCartItems().eq(itemIndex).find(this.selectors.itemDescription).invoke('text');
  }

  getItemPrice(itemIndex: number = 0): Cypress.Chainable<string> {
    return this.getCartItems().eq(itemIndex).find(this.selectors.itemPrice).invoke('text');
  }

  proceedToCheckout(): void {
    cy.get(this.selectors.proceedToCheckoutBtn).click();
    this.logger.pageAction('Clicked proceed to checkout');
  }

  continueShopping(): void {
    cy.get(this.selectors.continueShoppingBtn).click();
    this.logger.pageAction('Clicked continue shopping');
  }

  verifyItemInCart(itemName: string, quantity: string = '1'): void {
    this.getCartItems().should('contain.text', itemName);
    this.getCartItems().find(this.selectors.quantityInput).should('contain.text', quantity);
    this.logger.pageAction(`Verified item "${itemName}" is in cart with quantity ${quantity}`);
  }

  calculateTotalPrice(): Cypress.Chainable<number> {
    return this.getCartItems().then($items => {
      let total = 0;
      $items.each((index, item) => {
        const priceText = Cypress.$(item).find(this.selectors.itemPrice).text();
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        const quantityText = Cypress.$(item).find(this.selectors.quantityInput).text();
        const quantity = parseInt(quantityText);
        total += price * quantity;
      });
      return total;
    });
  }

  verifyCartTotal(): void {
    this.calculateTotalPrice().then(calculatedTotal => {
      cy.get(this.selectors.totalPrice).invoke('text').then(displayedTotal => {
        const total = parseFloat(displayedTotal.replace(/[^\d.]/g, ''));
        expect(total).to.equal(calculatedTotal);
      });
    });
    this.logger.pageAction('Verified cart total calculation');
  }
}