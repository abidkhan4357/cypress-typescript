import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  private selectors = {
    featuresItems: '.features_items',
    productWrapper: '.product-image-wrapper',
    productInfo: '.productinfo',
    productName: '.productinfo p',
    productPrice: '.productinfo h2',
    addToCartBtn: '.overlay-content .btn:contains("Add to cart")',
    viewProductBtn: '.overlay-content .btn:contains("View Product")',
    addToCartOverlay: '.overlay-content .btn',
    continueShopping: '.btn-success:contains("Continue Shopping")',
    viewCart: '.btn-success:contains("View Cart")',
    searchInput: '#search_product',
    searchBtn: '#submit_search',
    searchResults: '.features_items .product-image-wrapper',
    categoryMenu: '.category-products',
    brandMenu: '.brands_products'
  };

  visitProducts(): void {
    cy.visit('/products');
    this.waitForPageLoad();
    this.logger.pageAction('Visited products page');
  }

  verifyProductsPageLoaded(): void {
    cy.get(this.selectors.featuresItems).should('be.visible');
    cy.get(this.selectors.productWrapper).should('have.length.greaterThan', 0);
    this.logger.pageAction('Verified products page loaded');
  }

  getProducts(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.selectors.productWrapper);
  }

  getProductsCount(): Cypress.Chainable<number> {
    return this.getProducts().then($products => $products.length);
  }

  getProductName(index: number): Cypress.Chainable<string> {
    return this.getProducts().eq(index).find(this.selectors.productName).invoke('text');
  }

  getProductPrice(index: number): Cypress.Chainable<string> {
    return this.getProducts().eq(index).find(this.selectors.productPrice).invoke('text');
  }

  addProductToCart(index: number): void {
    this.getProducts().eq(index).trigger('mouseover').within(() => {
      cy.get(this.selectors.addToCartOverlay).click();
    });
    this.logger.pageAction(`Added product ${index} to cart`);
  }

  addProductToCartByName(productName: string): void {
    this.getProducts().contains(productName).parents(this.selectors.productWrapper).within(() => {
      cy.get(this.selectors.addToCartOverlay).click();
    });
    this.logger.pageAction(`Added product "${productName}" to cart`);
  }

  viewProduct(index: number): void {
    this.getProducts().eq(index).within(() => {
      cy.get(this.selectors.viewProductBtn).click();
    });
    this.logger.pageAction(`Viewed product ${index} details`);
  }

  continueShoppingFromModal(): void {
    cy.get(this.selectors.continueShopping).click();
    this.logger.pageAction('Clicked continue shopping from modal');
  }

  viewCartFromModal(): void {
    cy.get(this.selectors.viewCart).click();
    this.logger.pageAction('Clicked view cart from modal');
  }

  searchProduct(searchTerm: string): void {
    cy.get(this.selectors.searchInput).clear().type(searchTerm);
    cy.get(this.selectors.searchBtn).click();
    this.logger.pageAction(`Searched for product: ${searchTerm}`);
  }

  verifySearchResults(expectedTerm: string): void {
    cy.get(this.selectors.searchResults).should('have.length.greaterThan', 0);
    cy.get(this.selectors.searchResults).each($product => {
      cy.wrap($product).find(this.selectors.productName).invoke('text').should('match', new RegExp(expectedTerm, 'i'));
    });
    this.logger.pageAction(`Verified search results for: ${expectedTerm}`);
  }

  verifyNoSearchResults(): void {
    cy.get(this.selectors.searchResults).should('have.length', 0);
    this.logger.pageAction('Verified no search results found');
  }

  selectCategory(categoryName: string): void {
    cy.get(this.selectors.categoryMenu).contains(categoryName).click();
    this.logger.pageAction(`Selected category: ${categoryName}`);
  }

  selectBrand(brandName: string): void {
    cy.get(this.selectors.brandMenu).contains(brandName).click();
    this.logger.pageAction(`Selected brand: ${brandName}`);
  }

  addMultipleProductsToCart(productIndices: number[]): void {
    productIndices.forEach((index, i) => {
      this.addProductToCart(index);
      
      if (i < productIndices.length - 1) {
        this.continueShoppingFromModal();
      }
    });
    this.logger.pageAction(`Added ${productIndices.length} products to cart`);
  }

  verifyProductModal(): void {
    cy.get('.modal-content').should('be.visible');
    cy.get('.modal-body').should('contain.text', 'Your product has been added to cart.');
    this.logger.pageAction('Verified product added modal');
  }

  getProductDetails(index: number): Cypress.Chainable<{name: string, price: string}> {
    return this.getProducts().eq(index).within(() => {
      let productDetails: {name: string, price: string} = { name: '', price: '' };
      
      return cy.get(this.selectors.productName).invoke('text').then(name => {
        productDetails.name = name.trim();
        return cy.get(this.selectors.productPrice).invoke('text');
      }).then(price => {
        productDetails.price = price.trim();
        return productDetails;
      });
    });
  }

  verifyProductsDisplayed(): void {
    this.getProducts().should('have.length.greaterThan', 0);
    
    this.getProducts().each($product => {
      cy.wrap($product).within(() => {
        cy.get(this.selectors.productName).should('be.visible').should('not.be.empty');
        cy.get(this.selectors.productPrice).should('be.visible').should('not.be.empty');
      });
    });
    
    this.logger.pageAction('Verified all products are properly displayed');
  }
}