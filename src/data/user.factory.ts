import { faker } from '@faker-js/faker';
import { BaseFactory, FactoryBuilder } from './base.factory';
import { User, UserRegistrationData, LoginCredentials, UserProfile } from '@types/user.types';

export class UserFactory extends BaseFactory<User> {
  protected createDefault(): User {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    return {
      id: faker.number.int({ min: 1000, max: 9999 }),
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: this.generateSecurePassword(),
      title: this.getRandomFromArray(['Mr', 'Mrs']),
      birth_date: faker.date.birthdate().getDate().toString(),
      birth_month: (faker.date.birthdate().getMonth() + 1).toString(),
      birth_year: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).getFullYear().toString(),
      firstname: firstName,
      lastname: lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'United States',
      zipcode: faker.location.zipCode(),
      state: faker.location.state(),
      city: faker.location.city(),
      mobile_number: faker.phone.number('##########')
    };
  }

  private generateSecurePassword(): string {
    return faker.internet.password({
      length: 12,
      memorable: false,
      pattern: /[A-Za-z0-9!@#$%^&*]/
    });
  }

  createTestUser(): User {
    return this.create({
      email: `test.user.${Date.now()}@automation.test`,
      password: 'TestPassword123!',
      name: 'Test User'
    });
  }

  createAdminUser(): User {
    return this.create({
      email: `admin.${Date.now()}@automation.test`,
      password: 'AdminPassword123!',
      name: 'Admin User'
    });
  }

  createUserWithInvalidEmail(): User {
    return this.create({
      email: 'invalid-email-format'
    });
  }

  createUserWithWeakPassword(): User {
    return this.create({
      password: '123'
    });
  }

  static builder(): FactoryBuilder<User> {
    return new FactoryBuilder(new UserFactory());
  }
}

export class UserRegistrationFactory extends BaseFactory<UserRegistrationData> {
  private userFactory = new UserFactory();

  protected createDefault(): UserRegistrationData {
    const baseUser = this.userFactory.createDefault();
    
    return {
      ...baseUser,
      confirmPassword: baseUser.password,
      newsletter: this.getRandomBoolean(),
      offers: this.getRandomBoolean()
    };
  }

  createValidRegistration(): UserRegistrationData {
    const user = this.createDefault();
    return {
      ...user,
      confirmPassword: user.password
    };
  }

  createWithMismatchedPasswords(): UserRegistrationData {
    const user = this.createDefault();
    return {
      ...user,
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!'
    };
  }

  createWithExistingEmail(existingEmail: string): UserRegistrationData {
    return this.create({
      email: existingEmail
    });
  }

  createMinimalRegistration(): UserRegistrationData {
    const user = this.createDefault();
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
      firstname: user.firstname!,
      lastname: user.lastname!,
      address1: user.address1!,
      country: user.country!,
      state: user.state!,
      city: user.city!,
      zipcode: user.zipcode!,
      mobile_number: user.mobile_number!,
      newsletter: false,
      offers: false
    };
  }

  static builder(): FactoryBuilder<UserRegistrationData> {
    return new FactoryBuilder(new UserRegistrationFactory());
  }
}

export class LoginCredentialsFactory extends BaseFactory<LoginCredentials> {
  protected createDefault(): LoginCredentials {
    const userFactory = new UserFactory();
    const user = userFactory.createDefault();
    
    return {
      email: user.email,
      password: user.password
    };
  }

  createValidCredentials(): LoginCredentials {
    return this.createDefault();
  }

  createInvalidCredentials(): LoginCredentials {
    return {
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    };
  }

  createWithInvalidEmail(): LoginCredentials {
    return this.create({
      email: 'invalid-email-format'
    });
  }

  createWithEmptyPassword(): LoginCredentials {
    return this.create({
      password: ''
    });
  }

  createWithEmptyEmail(): LoginCredentials {
    return this.create({
      email: ''
    });
  }

  static builder(): FactoryBuilder<LoginCredentials> {
    return new FactoryBuilder(new LoginCredentialsFactory());
  }
}

export class UserProfileFactory extends BaseFactory<UserProfile> {
  private userFactory = new UserFactory();

  protected createDefault(): UserProfile {
    const baseUser = this.userFactory.createDefault();
    
    return {
      ...baseUser,
      preferences: {
        newsletter: faker.datatype.boolean(),
        offers: faker.datatype.boolean(),
        theme: this.getRandomFromArray(['light', 'dark']),
        language: this.getRandomFromArray(['en', 'es', 'fr', 'de'])
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      isActive: faker.datatype.boolean()
    };
  }

  createActiveProfile(): UserProfile {
    return this.create({
      isActive: true,
      preferences: {
        newsletter: true,
        offers: true,
        theme: 'light',
        language: 'en'
      }
    });
  }

  createInactiveProfile(): UserProfile {
    return this.create({
      isActive: false
    });
  }

  static builder(): FactoryBuilder<UserProfile> {
    return new FactoryBuilder(new UserProfileFactory());
  }
}

// Convenience exports for easy access
export const userFactory = new UserFactory();
export const userRegistrationFactory = new UserRegistrationFactory();
export const loginCredentialsFactory = new LoginCredentialsFactory();
export const userProfileFactory = new UserProfileFactory();