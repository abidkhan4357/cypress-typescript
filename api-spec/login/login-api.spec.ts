import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { UserService, apiFactory, UserDataFactory, LoginDataFactory } from '../../api-client';
import { CreateAccountPayload } from '../../api-client/types/api.types';

describe('Login API Tests', () => {
  let userService: UserService;
  let testUser: CreateAccountPayload;

  beforeEach(() => {
    userService = new UserService(apiFactory.getHttpClient());
  });

  afterEach(async () => {
    // Cleanup created test users
    try {
      if (testUser) {
        await userService.deleteAccount(testUser.email, testUser.password);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should successfully login with valid credentials', async () => {
    const credentials = LoginDataFactory.validCredentials();
    const response = await userService.verifyLogin(credentials);

    expect(response.status).toBe(200);
    expect(response.data.responseCode).toBe(200);
    expect(response.data.message).toBe('User exists!');
  });

  it('should return error for invalid credentials', async () => {
    const credentials = LoginDataFactory.invalidCredentials();
    const response = await userService.verifyLogin(credentials);

    expect(response.status).toBe(200);
    expect(response.data.responseCode).toBe(404);
    expect(response.data.message).toBe('User not found!');
  });

  it('should return error for empty email', async () => {
    const credentials = LoginDataFactory.emptyEmail();
    const response = await userService.verifyLogin(credentials);

    expect(response.status).toBe(200);
    expect(response.data.responseCode).toBe(404);
    expect(response.data.message).toBe('User not found!');
  });

  it('should return error for empty password', async () => {
    const credentials = LoginDataFactory.emptyPassword();
    const response = await userService.verifyLogin(credentials);

    expect(response.status).toBe(200);
    expect(response.data.responseCode).toBe(404);
    expect(response.data.message).toBe('User not found!');
  });
});