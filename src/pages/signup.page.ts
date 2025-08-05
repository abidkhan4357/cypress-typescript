import { BasePage } from './base.page';
import { PageElements } from '@types/test.types';
import { UserRegistrationData } from '@types/user.types';
import { logger } from '@utils/logger';

export class SignupPage extends BasePage {
  protected url = '/signup';
  protected pageTitle = 'Automation Exercise - Signup';

  protected elements: PageElements = {
    pageTitle: {
      selector: '.login-form h2 b',
      description: 'Enter Account Information title',
      type: 'text',
      required: true
    },
    titleMr: {
      selector: '#id_gender1',
      description: 'Title Mr radio button',
      type: 'radio',
      required: true
    },
    titleMrs: {
      selector: '#id_gender2',
      description: 'Title Mrs radio button',
      type: 'radio',
      required: true
    },
    password: {
      selector: '#password',
      description: 'Password input',
      type: 'input',
      required: true
    },
    birthDay: {
      selector: '#days',
      description: 'Birth day dropdown',
      type: 'dropdown',
      required: true
    },
    birthMonth: {
      selector: '#months',
      description: 'Birth month dropdown',
      type: 'dropdown',
      required: true
    },
    birthYear: {
      selector: '#years',
      description: 'Birth year dropdown',
      type: 'dropdown',
      required: true
    },
    newsletterCheckbox: {
      selector: '#newsletter',
      description: 'Newsletter checkbox',
      type: 'checkbox',
      required: false
    },
    offersCheckbox: {
      selector: '#optin',
      description: 'Special offers checkbox',
      type: 'checkbox',
      required: false
    },
    firstName: {
      selector: '#first_name',
      description: 'First name input',
      type: 'input',
      required: true
    },
    lastName: {
      selector: '#last_name',
      description: 'Last name input',
      type: 'input',
      required: true
    },
    company: {
      selector: '#company',
      description: 'Company input',
      type: 'input',
      required: false
    },
    address1: {
      selector: '#address1',
      description: 'Address 1 input',
      type: 'input',
      required: true
    },
    address2: {
      selector: '#address2',
      description: 'Address 2 input',
      type: 'input',
      required: false
    },
    country: {
      selector: '#country',
      description: 'Country dropdown',
      type: 'dropdown',
      required: true
    },
    state: {
      selector: '#state',
      description: 'State input',
      type: 'input',
      required: true
    },
    city: {
      selector: '#city',
      description: 'City input',
      type: 'input',
      required: true
    },
    zipcode: {
      selector: '#zipcode',
      description: 'Zipcode input',
      type: 'input',
      required: true
    },
    mobileNumber: {
      selector: '#mobile_number',
      description: 'Mobile number input',
      type: 'input',
      required: true
    },
    createAccountButton: {
      selector: 'button[data-qa="create-account"]',
      description: 'Create Account button',
      type: 'button',
      required: true
    },
    errorMessage: {
      selector: '.alert-danger',
      description: 'Error message',
      type: 'text',
      required: false
    }
  };

  fillRegistrationForm(userData: UserRegistrationData): Cypress.Chainable {
    logger.step(`Fill registration form for user: ${userData.name}`);
    
    return this.waitForElement('pageTitle')
      .then(() => {
        // Select title
        if (userData.title === 'Mr') {
          return this.check('titleMr');
        } else if (userData.title === 'Mrs') {
          return this.check('titleMrs');
        }
        return cy.wrap(null);
      })
      .then(() => this.type('password', userData.password))
      .then(() => {
        // Birth date
        if (userData.birth_date) {
          return this.select('birthDay', userData.birth_date);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.birth_month) {
          return this.select('birthMonth', userData.birth_month);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.birth_year) {
          return this.select('birthYear', userData.birth_year);
        }
        return cy.wrap(null);
      })
      .then(() => {
        // Checkboxes
        if (userData.newsletter) {
          return this.check('newsletterCheckbox');
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.offers) {
          return this.check('offersCheckbox');
        }
        return cy.wrap(null);
      })
      .then(() => {
        // Address information
        if (userData.firstname) {
          return this.type('firstName', userData.firstname);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.lastname) {
          return this.type('lastName', userData.lastname);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.company) {
          return this.type('company', userData.company);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.address1) {
          return this.type('address1', userData.address1);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.address2) {
          return this.type('address2', userData.address2);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.country) {
          return this.select('country', userData.country);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.state) {
          return this.type('state', userData.state);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.city) {
          return this.type('city', userData.city);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.zipcode) {
          return this.type('zipcode', userData.zipcode);
        }
        return cy.wrap(null);
      })
      .then(() => {
        if (userData.mobile_number) {
          return this.type('mobileNumber', userData.mobile_number);
        }
        return cy.wrap(null);
      });
  }

  createAccount(): Cypress.Chainable {
    logger.step('Click Create Account button');
    return this.click('createAccountButton');
  }

  completeRegistration(userData: UserRegistrationData): Cypress.Chainable {
    logger.step(`Complete registration for user: ${userData.name}`);
    
    return this.fillRegistrationForm(userData)
      .then(() => this.createAccount());
  }

  verifySignupPageLoaded(): Cypress.Chainable {
    logger.step('Verify signup page is loaded');
    
    return this.verifyPageLoaded()
      .then(() => this.waitForElement('pageTitle'))
      .then(() => this.verifyText('pageTitle', 'ENTER ACCOUNT INFORMATION'));
  }

  verifyRegistrationError(expectedError?: string): Cypress.Chainable {
    logger.step('Verify registration error message');
    
    const errorElement = this.waitForElement('errorMessage');
    
    if (expectedError) {
      return errorElement.then(() => this.verifyText('errorMessage', expectedError));
    }
    
    return errorElement.should('be.visible');
  }

  verifySuccessfulRegistration(): Cypress.Chainable {
    logger.step('Verify successful registration redirect');
    
    return cy.url()
      .should('include', '/account_created')
      .then(() => {
        return cy.get('h2[data-qa="account-created"]')
          .should('be.visible')
          .should('contain.text', 'Account Created!');
      });
  }

  clearAllFields(): Cypress.Chainable {
    logger.step('Clear all registration form fields');
    
    const inputFields = [
      'password', 'firstName', 'lastName', 'company',
      'address1', 'address2', 'state', 'city', 'zipcode', 'mobileNumber'
    ];
    
    return cy.wrap(inputFields).each((field) => {
      return this.getElement(field as string).clear();
    });
  }

  fillMinimalRequiredFields(userData: Partial<UserRegistrationData>): Cypress.Chainable {
    logger.step('Fill minimal required fields for registration');
    
    if (!userData.password || !userData.firstname || !userData.lastname || 
        !userData.address1 || !userData.state || !userData.city || 
        !userData.zipcode || !userData.mobile_number) {
      throw new Error('Missing required fields for minimal registration');
    }
    
    return this.type('password', userData.password)
      .then(() => this.type('firstName', userData.firstname!))
      .then(() => this.type('lastName', userData.lastname!))
      .then(() => this.type('address1', userData.address1!))
      .then(() => this.select('country', userData.country || 'United States'))
      .then(() => this.type('state', userData.state!))
      .then(() => this.type('city', userData.city!))
      .then(() => this.type('zipcode', userData.zipcode!))
      .then(() => this.type('mobileNumber', userData.mobile_number!));
  }

  getSelectedTitle(): Cypress.Chainable<string> {
    return cy.get('input[name="title"]:checked').then($radio => {
      return $radio.attr('id') === 'id_gender1' ? 'Mr' : 'Mrs';
    });
  }

  getSelectedBirthDate(): Cypress.Chainable<{day: string; month: string; year: string}> {
    return cy.get('#days option:selected').invoke('text')
      .then(day => {
        return cy.get('#months option:selected').invoke('text')
          .then(month => {
            return cy.get('#years option:selected').invoke('text')
              .then(year => ({
                day: day.trim(),
                month: month.trim(),
                year: year.trim()
              }));
          });
      });
  }

  isNewsletterChecked(): Cypress.Chainable<boolean> {
    return this.getElement('newsletterCheckbox').then($checkbox => {
      return $checkbox.is(':checked');
    });
  }

  isOffersChecked(): Cypress.Chainable<boolean> {
    return this.getElement('offersCheckbox').then($checkbox => {
      return $checkbox.is(':checked');
    });
  }
}