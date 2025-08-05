import { signupPage } from '../../pages/signup.page';
import { userFactory } from '../../data/user-factory';

describe('Signup feature tests', () => {
  let createdUserEmail: string;
  let createdUserPassword: string;

  beforeEach(() => {
    signupPage.navigateToSignupPage();
  });

  afterEach(() => {
    // Cleanup - Delete user via API if created
    if (createdUserEmail && createdUserPassword) {
      cy.log('Cleaning up created user:', createdUserEmail);
      
      cy.request({
        method: 'DELETE',
        url: '/api/deleteAccount',
        form: true,
        body: {
          email: createdUserEmail,
          password: createdUserPassword
        },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          cy.log('User deleted successfully');
        } else {
          cy.log('User deletion failed or user not found');
        }
      });
      
      // Reset for next test
      createdUserEmail = '';
      createdUserPassword = '';
    }
  });

  it('should successfully create a new account with valid information', () => {
    cy.fixture('test-data').then((testData) => {
      const newUser = { 
        ...testData.users.newUser,
        // Make email unique to avoid conflicts
        email: `test${Date.now()}@automation.test`
      };
      
      createdUserEmail = newUser.email;
      createdUserPassword = newUser.password;
      
      signupPage.signupNewUser(newUser);
      signupPage.assertAccountCreatedSuccessfully();
    });
  });

  it('should show error message when trying to signup with existing email', () => {
    const newUser = userFactory.generate('randomUser');
    
    createdUserEmail = newUser.email;
    createdUserPassword = newUser.password;
    cy.request({
      method: 'POST',
      url: '/api/createAccount',
      form: true,
      body: {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        title: newUser.title,
        birth_date: newUser.birth_date,
        birth_month: newUser.birth_month,
        birth_year: newUser.birth_year,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        company: newUser.company,
        address1: newUser.address1,
        address2: newUser.address2,
        country: newUser.country,
        zipcode: newUser.zipcode,
        state: newUser.state,
        city: newUser.city,
        mobile_number: newUser.mobile_number
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      
      if (response.body && typeof response.body === 'object') {
        if (response.body.responseCode !== undefined) {
          expect(response.body.responseCode).to.be.oneOf([200, 201]);
        }
        if (response.body.message) {
          expect(response.body.message).to.match(/User created!|Account created successfully!|created/i);
        }
      }
      
      signupPage.enterInitialSignupInfo(newUser.name, newUser.email);
      signupPage.assertEmailAlreadyExists();
    });
  });
});