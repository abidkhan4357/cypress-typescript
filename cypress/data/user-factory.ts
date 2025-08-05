import { faker } from '@faker-js/faker';

export interface UserData {
  name: string;
  email: string; 
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class UserFactory {
  private static instance: UserFactory;

  static getInstance(): UserFactory {
    if (!UserFactory.instance) {
      UserFactory.instance = new UserFactory();
    }
    return UserFactory.instance;
  }

  createValidUser(): UserData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    
    return {
      name: `${firstName} ${lastName}`,
      email,
      password: faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z0-9!@#$%^&*]/ }),
      title: faker.helpers.arrayElement(['Mr', 'Mrs']),
      birth_date: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).getDate().toString(),
      birth_month: (faker.date.birthdate().getMonth() + 1).toString(),
      birth_year: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).getFullYear().toString(),
      firstname: firstName,
      lastname: lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress() || '',
      country: 'United States',
      zipcode: faker.location.zipCode(),
      state: faker.location.state(),
      city: faker.location.city(),
      mobile_number: faker.string.numeric(10),
    };
  }

  createUserWithInvalidEmail(): UserData {
    const user = this.createValidUser();
    user.email = 'invalid-email-format';
    return user;
  }

  createUserWithEmptyFields(): UserData {
    const user = this.createValidUser();
    user.name = '';
    user.email = '';
    user.password = '';
    return user;
  }

  createUserWithWeakPassword(): UserData {
    const user = this.createValidUser();
    user.password = '123';
    return user;
  }

  createUserWithSpecialCharacters(): UserData {
    const user = this.createValidUser();
    user.name = 'Test User™ & Co.';
    user.firstname = 'Test™';
    user.lastname = 'User®';
    user.company = 'Company & Co. Ltd.';
    user.address1 = '123 Main St. #456';
    return user;
  }

  createBulkUsers(count: number): UserData[] {
    return Array.from({ length: count }, () => this.createValidUser());
  }

  createLoginCredentials(user?: UserData): LoginCredentials {
    if (user) {
      return {
        email: user.email,
        password: user.password,
      };
    }
    
    return {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 12 }),
    };
  }

  createInvalidCredentials(): LoginCredentials {
    return {
      email: 'nonexistent@example.com',
      password: 'wrongpassword123',
    };
  }

  // User factory generate method
  generate(userType: string): any {
    switch (userType) {
      case 'validUser':
        return {
          email: 'billsmith123@gmail.com',
          password: 'QATest1!',
          firstName: 'Bill',
          lastName: 'Smith'
        };
      case 'invalidEmailAndPassword':
        return {
          email: 'fake@fake.com',
          password: 'fakepassword',
          firstName: 'Fake',
          lastName: 'User'
        };
      case 'invalidEmail':
        return {
          email: 'invalid@invalid.com',
          password: 'QATest1!',
          firstName: 'Invalid',
          lastName: 'Email'
        };
      case 'invalidPassword':
        return {
          email: 'billsmith123@gmail.com',
          password: 'wrongpassword',
          firstName: 'Invalid',
          lastName: 'Password'
        };
      case 'emptyCredentials':
        return {
          email: '',
          password: '',
          firstName: '',
          lastName: ''
        };
      case 'randomUser':
        const randomUser = this.createValidUser();
        return {
          ...randomUser,
          firstName: randomUser.firstname,
          lastName: randomUser.lastname,
          address: {
            street: randomUser.address1,
            city: randomUser.city,
            state: randomUser.state,
            zipCode: randomUser.zipcode
          },
          phone: randomUser.mobile_number
        };
      default:
        return this.createValidUser();
    }
  }

  createAdminUser(): UserData {
    const user = this.createValidUser();
    user.email = 'admin@automation.test';
    user.password = 'AdminPass123!';
    return user;
  }

  loadUserFromFixture(userType: string): Cypress.Chainable<any> {
    return cy.fixture('test-data').then((testData) => {
      return testData.users[userType] || testData.users.validUser;
    });
  }
}

export const userFactory = UserFactory.getInstance();