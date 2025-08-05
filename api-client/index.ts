export * from './types/api.types';
export * from './utils/http-client';
export * from './services/user.service';
export * from './data/user.factory';

import { HttpClient } from './utils/http-client';

class ApiFactory {
  private static instance: ApiFactory;
  private httpClient: HttpClient;

  private constructor() {
    const baseURL = this.getBaseURL();
    this.httpClient = new HttpClient(baseURL);
  }

  static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  private getBaseURL(): string {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_BASE_URL || 'https://automationexercise.com/api';
    }
    
    if (typeof Cypress !== 'undefined') {
      return Cypress.env('apiUrl') || 'https://automationexercise.com/api';
    }
    
    return 'https://automationexercise.com/api';
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  setBaseURL(baseURL: string): void {
    this.httpClient.setBaseURL(baseURL);
  }

  setTimeout(timeout: number): void {
    this.httpClient.setTimeout(timeout);
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    this.httpClient.setDefaultHeaders(headers);
  }

  reset(): void {
    const baseURL = this.getBaseURL();
    this.httpClient = new HttpClient(baseURL);
  }
}

export const apiFactory = ApiFactory.getInstance();