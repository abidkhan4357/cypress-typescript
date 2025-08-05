import { CreateAccountPayload, AuthCredentials } from '../types/api.types';

export class UserDataFactory {
  static createValidUser(): CreateAccountPayload {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const unique = `${timestamp}${random}`;
    
    return {
      name: `Test User ${unique}`,
      email: `testuser${unique}@example.com`,
      password: 'TestPassword123!',
      title: 'Mr',
      birth_date: '15',
      birth_month: '6',
      birth_year: '1990',
      firstname: 'Test',
      lastname: 'User',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apt 1',
      country: 'United States',
      zipcode: '12345',
      state: 'California',
      city: 'Los Angeles',
      mobile_number: '1234567890'
    };
  }

  static createUserWithEmptyEmail(): CreateAccountPayload {
    const user = this.createValidUser();
    user.email = '';
    return user;
  }

  static createUserWithInvalidEmail(): CreateAccountPayload {
    const user = this.createValidUser();
    user.email = 'invalid-email-format';
    return user;
  }

  static createMultipleUsers(count: number): CreateAccountPayload[] {
    return Array.from({ length: count }, () => this.createValidUser());
  }
}

export class LoginDataFactory {
  static validCredentials(): AuthCredentials {
    return {
      email: 'billsmith123@gmail.com',
      password: 'QATest1!'
    };
  }

  static invalidCredentials(): AuthCredentials {
    return {
      email: 'nonexistent@example.com',
      password: 'wrongpassword123'
    };
  }

  static emptyEmail(): AuthCredentials {
    return {
      email: '',
      password: 'password123'
    };
  }

  static emptyPassword(): AuthCredentials {
    return {
      email: 'test@example.com',
      password: ''
    };
  }

  static emptyCredentials(): AuthCredentials {
    return {
      email: '',
      password: ''
    };
  }
}