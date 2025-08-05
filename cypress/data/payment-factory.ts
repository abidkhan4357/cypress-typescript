import { faker } from '@faker-js/faker';

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentFactory {
  private static instance: PaymentFactory;

  static getInstance(): PaymentFactory {
    if (!PaymentFactory.instance) {
      PaymentFactory.instance = new PaymentFactory();
    }
    return PaymentFactory.instance;
  }

  // Payment factory generate method
  generate(paymentType: string): PaymentData {
    switch (paymentType) {
      case 'valid':
        return {
          nameOnCard: 'Test User',
          cardNumber: '4242424242424242',
          cvc: '123',
          expiryMonth: '12',
          expiryYear: '2025'
        };
      case 'invalid':
        return {
          nameOnCard: 'Invalid User',
          cardNumber: '1111111111111111',
          cvc: '000',
          expiryMonth: '01',
          expiryYear: '2020'
        };
      case 'expired':
        return {
          nameOnCard: 'Expired User',
          cardNumber: '4242424242424242',
          cvc: '123',
          expiryMonth: '01',
          expiryYear: '2020'
        };
      default:
        return this.generate('valid');
    }
  }

  createValidPayment(): PaymentData {
    return {
      nameOnCard: faker.person.fullName(),
      cardNumber: '4242424242424242', // Stripe test card
      cvc: faker.string.numeric(3),
      expiryMonth: faker.date.future().getMonth().toString().padStart(2, '0'),
      expiryYear: faker.date.future({ years: 5 }).getFullYear().toString()
    };
  }

  createInvalidPayment(): PaymentData {
    return {
      nameOnCard: faker.person.fullName(),
      cardNumber: '1111111111111111',
      cvc: '000',
      expiryMonth: '01',
      expiryYear: '2020'
    };
  }
}

export const paymentFactory = PaymentFactory.getInstance();