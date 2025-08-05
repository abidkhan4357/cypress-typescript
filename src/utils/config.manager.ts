import { TestConfig } from '@types/test.types';

class ConfigManager {
  private config: TestConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): TestConfig {
    const environment = this.getEnvironment();
    
    const baseConfigs: Record<string, Partial<TestConfig>> = {
      development: {
        baseUrl: 'https://automationexercise.com',
        apiUrl: 'https://automationexercise.com/api',
        timeouts: {
          default: 8000,
          request: 10000,
          response: 10000,
          pageLoad: 30000
        },
        retries: {
          runMode: 0,
          openMode: 0
        }
      },
      staging: {
        baseUrl: 'https://staging.automationexercise.com',
        apiUrl: 'https://staging.automationexercise.com/api',
        timeouts: {
          default: 12000,
          request: 15000,
          response: 15000,
          pageLoad: 35000
        },
        retries: {
          runMode: 1,
          openMode: 0
        }
      },
      production: {
        baseUrl: 'https://automationexercise.com',
        apiUrl: 'https://automationexercise.com/api',
        timeouts: {
          default: 15000,
          request: 20000,
          response: 20000,
          pageLoad: 45000
        },
        retries: {
          runMode: 3,
          openMode: 0
        }
      }
    };

    const defaultConfig: TestConfig = {
      environment: environment as TestConfig['environment'],
      baseUrl: 'https://automationexercise.com',
      apiUrl: 'https://automationexercise.com/api',
      browser: 'chrome',
      headless: true,
      viewport: {
        width: 1920,
        height: 1080
      },
      timeouts: {
        default: 10000,
        request: 15000,
        response: 15000,
        pageLoad: 30000
      },
      retries: {
        runMode: 2,
        openMode: 0
      }
    };

    return {
      ...defaultConfig,
      ...baseConfigs[environment]
    };
  }

  getEnvironment(): string {
    return process.env.CYPRESS_ENV || 
           process.env.NODE_ENV || 
           (typeof Cypress !== 'undefined' ? Cypress.env('environment') : null) || 
           'development';
  }

  getConfig(): TestConfig {
    return this.config;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getBrowser(): string {
    return this.config.browser;
  }

  getViewport(): { width: number; height: number } {
    return this.config.viewport;
  }

  getTimeouts(): TestConfig['timeouts'] {
    return this.config.timeouts;
  }

  getRetries(): TestConfig['retries'] {
    return this.config.retries;
  }

  isHeadless(): boolean {
    return this.config.headless;
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  updateConfig(updates: Partial<TestConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

export const configManager = new ConfigManager();