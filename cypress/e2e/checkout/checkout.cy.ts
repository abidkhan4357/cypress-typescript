import { paymentFactory } from '../../data/payment-factory';
import { productFactory } from '../../data/product-factory';
import { userFactory } from '../../data/user-factory';
import { productPage } from '../../pages/product.page';
import { cartPage } from '../../pages/cart.page';
import { checkoutPage } from '../../pages/checkout.page';
import { paymentPage } from '../../pages/payment.page';
import { orderConfirmationPage } from '../../pages/order-confirmation.page';
import { homePage } from '../../pages/home.page';
import { loginPage } from '../../pages/login.page';

describe('Checkout feature tests', () => {
  beforeEach(() => {
    const validUser = userFactory.generate('validUser');
    loginPage.navigateToLoginPage();
    loginPage.login(validUser.email, validUser.password);
    
    cy.visit('/');
    homePage.isLogoutVisible({ timeout: 10000 });
  });

  it('should complete checkout process', () => {
    productFactory.getAllProductListByApi().then((products) => {
      const product1 = products.find(p => p.name === 'Blue Top');
      const product2 = products.find(p => p.name === 'Men Tshirt');
      
      productPage.navigateToProductsPage();
      
      if (product1) {
        productPage.addProductByName(product1.name);
      }
      if (product2) {
        productPage.addProductByName(product2.name);
      }
      
      productPage.viewCart();
      
      cartPage.getCartItemCount().then((cartItemCount) => {
        expect(cartItemCount).to.be.greaterThan(0);
      });
      
      cartPage.proceedToCheckout();
      
      checkoutPage.isOnCheckoutPage().then((isOnCheckout) => {
        expect(isOnCheckout).to.be.true;
      });
      
      checkoutPage.addOrderComment('Please deliver during business hours.');
      checkoutPage.placeOrder();
      
      cy.fixture('test-data').then((testData) => {
        const paymentInfo = testData.checkout.paymentData;
        paymentPage.completePayment(
          paymentInfo.nameOnCard,
          paymentInfo.cardNumber,
          paymentInfo.cvc,
          paymentInfo.expiryMonth,
          paymentInfo.expiryYear
        );
      });
      
      orderConfirmationPage.assertOrderPlacedSuccessfully();
    });
  });
});