import { userFactory } from '../../data/user-factory';
import { loginPage } from '../../pages/login.page';

describe('Login feature tests', () => {
  beforeEach(() => {
    loginPage.navigateToLoginPage();
  });

  it('should login successfully with valid credentials', () => {
    const validUser = userFactory.generate('validUser');
    
    loginPage.login(validUser.email, validUser.password);
    
    loginPage.getLoggedInAsText().then((loggedInAsText) => {
      expect(loggedInAsText).to.contain(validUser.firstName);
    });
  });

  it('should show error message with invalid email and invalid password', () => {
    const invalidUser = userFactory.generate('invalidEmailAndPassword');
    
    loginPage.login(invalidUser.email, invalidUser.password);
    
    loginPage.assertInvalidCredentialsError();
  });

  it('should show error message with invalid email', () => {
    const invalidEmailUser = userFactory.generate('invalidEmail');
    
    loginPage.login(invalidEmailUser.email, invalidEmailUser.password);
    
    loginPage.assertInvalidCredentialsError();
  });

  it('should show error message with invalid password', () => {
    const invalidPasswordUser = userFactory.generate('invalidPassword');
    
    loginPage.login(invalidPasswordUser.email, invalidPasswordUser.password);
    
    loginPage.assertInvalidCredentialsError();
  });

  it('should show error message with empty credentials', () => {
    const emptyUser = userFactory.generate('emptyCredentials');
    
    loginPage.login(emptyUser.email, emptyUser.password);
    
    // For empty credentials, the form might not even submit due to HTML5 validation
    // or stay on the same page, so we verify we're still on login page
    cy.url().should('include', '/login');
    
    // Check if login button is still visible (meaning login didn't succeed)
    cy.get('[data-qa="login-button"]').should('be.visible');
  });
});