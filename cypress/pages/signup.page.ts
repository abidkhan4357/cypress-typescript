import { UserData } from '../../data/user-factory';

export class SignupPage {
  private static instance: SignupPage;

  static getInstance(): SignupPage {
    if (!SignupPage.instance) {
      SignupPage.instance = new SignupPage();
    }
    return SignupPage.instance;
  }

  // Selectors
  private get nameInput() { return '[data-qa="signup-name"]'; }
  private get emailInput() { return '[data-qa="signup-email"]'; }
  private get signupButton() { return '[data-qa="signup-button"]'; }
  private get passwordInput() { return '#password'; }
  private get daysDropdown() { return '#days'; }
  private get monthsDropdown() { return '#months'; }
  private get yearsDropdown() { return '#years'; }
  private get newsletterCheckbox() { return '#newsletter'; }
  private get optinCheckbox() { return '#optin'; }
  private get createAccountButton() { return '[data-qa="create-account"]'; }
  private get accountCreatedMessage() { return '[data-qa="account-created"]'; }
  private get emailExistsError() { return '.signup-form p[style*="color: red"]'; }
  private get titleMr() { return '#id_gender1'; }
  private get titleMrs() { return '#id_gender2'; }
  private get firstNameInput() { return '#first_name'; }
  private get lastNameInput() { return '#last_name'; }
  private get companyInput() { return '#company'; }
  private get address1Input() { return '#address1'; }
  private get address2Input() { return '#address2'; }
  private get countryDropdown() { return '#country'; }
  private get stateInput() { return '#state'; }
  private get cityInput() { return '#city'; }
  private get zipcodeInput() { return '#zipcode'; }
  private get mobileNumberInput() { return '#mobile_number'; }

  // Actions
  navigateToSignupPage(): void {
    cy.visit('/login');
  }

  enterInitialSignupInfo(name: string, email: string): void {
    cy.get(this.nameInput).type(name);
    cy.get(this.emailInput).type(email);
    cy.get(this.signupButton).click();
  }

  fillAccountInformation(user: UserData): void {
    // Fill title
    if (user.title === 'Mr') {
      cy.get(this.titleMr).check();
    } else if (user.title === 'Mrs') {
      cy.get(this.titleMrs).check();
    }

    // Fill password
    cy.get(this.passwordInput).type(user.password);

    // Fill birth date
    if (user.birth_date) cy.get(this.daysDropdown).select(user.birth_date);
    if (user.birth_month) cy.get(this.monthsDropdown).select(user.birth_month);
    if (user.birth_year) cy.get(this.yearsDropdown).select(user.birth_year);

    // Check newsletter and offers
    cy.get(this.newsletterCheckbox).check();
    cy.get(this.optinCheckbox).check();

    // Fill personal information
    if (user.firstname) cy.get(this.firstNameInput).type(user.firstname);
    if (user.lastname) cy.get(this.lastNameInput).type(user.lastname);
    if (user.company) cy.get(this.companyInput).type(user.company);
    if (user.address1) cy.get(this.address1Input).type(user.address1);
    if (user.address2) cy.get(this.address2Input).type(user.address2);
    if (user.country) cy.get(this.countryDropdown).select(user.country);
    if (user.state) cy.get(this.stateInput).type(user.state);
    if (user.city) cy.get(this.cityInput).type(user.city);
    if (user.zipcode) cy.get(this.zipcodeInput).type(user.zipcode);
    if (user.mobile_number) cy.get(this.mobileNumberInput).type(user.mobile_number);

    // Submit form
    cy.get(this.createAccountButton).click();
  }

  signupNewUser(user: UserData): void {
    this.enterInitialSignupInfo(user.name, user.email);
    
    // Wait for navigation to signup form
    cy.url().should('include', '/signup');
    
    this.fillAccountInformation(user);
  }

  // Validations
  assertAccountCreatedSuccessfully(): void {
    cy.get(this.accountCreatedMessage).should('be.visible');
    cy.get(this.accountCreatedMessage).should('contain.text', 'Account Created!');
    cy.url().should('include', '/account_created');
  }

  assertEmailAlreadyExists(): void {
    cy.get(this.emailExistsError).should('be.visible');
    cy.get(this.emailExistsError).should('contain.text', 'Email Address already exist!');
  }
}

export const signupPage = SignupPage.getInstance();