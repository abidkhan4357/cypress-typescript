import { apiFactory } from '../api-client';
import { EnvironmentLoader } from '../config/environment.loader';

beforeAll(() => {
  // Show environment info
  EnvironmentLoader.printEnvironmentInfo();
  
  console.log('Starting API Test Suite');
  
  // Set default timeout for all tests
  jest.setTimeout(30000);
  
  // Configure API client for testing
  apiFactory.setTimeout(30000);
});

afterAll(() => {
  console.log('API Test Suite Completed');
});

beforeEach(() => {
  // Reset API client before each test
  apiFactory.reset();
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Extend Jest matchers for API testing
expect.extend({
  toBeSuccessfulResponse(received) {
    const pass = received.success === true && received.status >= 200 && received.status < 300;
    
    if (pass) {
      return {
        message: () => `expected response not to be successful`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to be successful, but got status ${received.status}`,
        pass: false,
      };
    }
  },

  toBeErrorResponse(received) {
    const pass = received.status >= 400;
    
    if (pass) {
      return {
        message: () => `expected response not to be error`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to be error, but got status ${received.status}`,
        pass: false,
      };
    }
  },

  toBeOneOf(received, array) {
    const pass = array.includes(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of [${array.join(', ')}]`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of [${array.join(', ')}]`,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSuccessfulResponse(): R;
      toBeErrorResponse(): R;
      toBeOneOf(array: any[]): R;
    }
  }
}