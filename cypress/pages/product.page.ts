export class ProductPage {
  private static instance: ProductPage;

  static getInstance(): ProductPage {
    if (!ProductPage.instance) {
      ProductPage.instance = new ProductPage();
    }
    return ProductPage.instance;
  }

  // Selectors
  private get productsLink() { return '.shop-menu .nav.navbar-nav li a[href="/products"]'; }
  private get cartLink() { return '.shop-menu .nav.navbar-nav li a[href="/view_cart"]'; }
  private get productItems() { return '.product-image-wrapper'; }
  private get addToCartButtons() { return '.btn.btn-default.add-to-cart'; }

  // Actions
  navigateToProductsPage(): void {
    cy.get(this.productsLink).click();
    cy.url().should('include', '/products');
  }

  addProductByName(productName: string): void {
    cy.get(this.productItems).contains(productName).parents('.product-image-wrapper').within(() => {
      cy.get('.productinfo').trigger('mouseover');
      cy.get('.overlay-content .btn').contains('Add to cart').click({ force: true });
    });
    
    cy.get('.modal-content').should('be.visible');
    cy.get('.btn-success').contains('Continue Shopping').click();
    cy.wait(500);
  }

  viewCart(): void {
    cy.get(this.cartLink).click();
    cy.url().should('include', '/view_cart');
  }
}

export const productPage = ProductPage.getInstance();