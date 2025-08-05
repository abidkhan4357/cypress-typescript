import * as fs from 'fs';
import * as path from 'path';

export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl: string;
  defaultUser: {
    email: string;
    password: string;
  };
  timeout: number;
  retries: number;
  headless: boolean;
}

export interface EnvironmentConfigs {
  [key: string]: EnvironmentConfig;
}

export class EnvironmentLoader {
  private static configPath = path.join(__dirname, 'environment.json');
  private static configs: EnvironmentConfigs;

  static loadConfigs(): EnvironmentConfigs {
    if (!this.configs) {
      try {
        const configFile = fs.readFileSync(this.configPath, 'utf8');
        this.configs = JSON.parse(configFile);
      } catch (error) {
        console.error('Failed to load environment configuration:', error);
        throw new Error('Environment configuration file not found or invalid');
      }
    }
    return this.configs;
  }

  static getConfig(environment: string): EnvironmentConfig {
    const configs = this.loadConfigs();
    const config = configs[environment];
    
    if (!config) {
      const availableEnvs = Object.keys(configs).join(', ');
      throw new Error(`Environment '${environment}' not found. Available environments: ${availableEnvs}`);
    }
    
    return config;
  }

  static getCurrentEnvironment(): string {
    // Check Cypress env variables first (from --env flags)
    if (typeof Cypress !== 'undefined' && Cypress.env('name')) {
      return Cypress.env('name');
    }
    
    // For Jest, ignore NODE_ENV=test and use our environments
    const nodeEnv = process.env.NODE_ENV;
    return process.env.TEST_ENV || 
           process.env.CYPRESS_ENV || 
           (nodeEnv && nodeEnv !== 'test' ? nodeEnv : null) ||
           'qa';
  }

  static getCurrentConfig(): EnvironmentConfig {
    const currentEnv = this.getCurrentEnvironment();
    return this.getConfig(currentEnv);
  }

  static getAvailableEnvironments(): string[] {
    const configs = this.loadConfigs();
    return Object.keys(configs);
  }

  static validateEnvironment(environment: string): boolean {
    const configs = this.loadConfigs();
    return environment in configs;
  }

  static setEnvironment(environment: string): void {
    if (!this.validateEnvironment(environment)) {
      throw new Error(`Invalid environment: ${environment}`);
    }
    process.env.TEST_ENV = environment;
  }

  static mergeWithEnvVars(config: EnvironmentConfig): EnvironmentConfig {
    return {
      ...config,
      baseUrl: process.env.UI_BASE_URL || config.baseUrl,
      apiBaseUrl: process.env.API_BASE_URL || config.apiBaseUrl,
      timeout: parseInt(process.env.TIMEOUT || '') || config.timeout,
      retries: parseInt(process.env.RETRIES || '') || config.retries,
      headless: process.env.HEADLESS === 'true' || config.headless,
      defaultUser: {
        email: process.env.DEFAULT_USER_EMAIL || config.defaultUser.email,
        password: process.env.DEFAULT_USER_PASSWORD || config.defaultUser.password
      }
    };
  }

  static createConfigForCypress(environment: string) {
    const config = this.getConfig(environment);
    const mergedConfig = this.mergeWithEnvVars(config);
    
    return {
      baseUrl: mergedConfig.baseUrl,
      env: {
        environment: environment,
        apiUrl: mergedConfig.apiBaseUrl,
        defaultUser: mergedConfig.defaultUser,
        headless: mergedConfig.headless
      },
      video: !mergedConfig.headless,
      screenshotOnRunFailure: true,
      chromeWebSecurity: false,
      viewportWidth: 1920,
      viewportHeight: 1080,
      defaultCommandTimeout: 10000,
      requestTimeout: mergedConfig.timeout,
      responseTimeout: mergedConfig.timeout,
      pageLoadTimeout: mergedConfig.timeout,
      retries: {
        runMode: mergedConfig.retries,
        openMode: 0
      }
    };
  }

  static createConfigForJest(environment: string) {
    const config = this.getConfig(environment);
    const mergedConfig = this.mergeWithEnvVars(config);
    
    return {
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/api-spec/setup.ts'],
      testMatch: ['<rootDir>/api-spec/**/*.spec.ts'],
      testTimeout: mergedConfig.timeout + 5000,
      maxWorkers: environment === 'prod' ? 1 : 4,
      verbose: environment === 'local',
      bail: environment === 'prod' ? 1 : 0,
      globals: {
        TEST_ENV: environment,
        API_BASE_URL: mergedConfig.apiBaseUrl,
        API_TIMEOUT: mergedConfig.timeout,
        DEFAULT_USER: mergedConfig.defaultUser
      }
    };
  }

  static printEnvironmentInfo(environment?: string): void {
    const env = environment || this.getCurrentEnvironment();
    const config = this.getConfig(env);
    
    console.log(`\nEnvironment: ${env.toUpperCase()}`);
    console.log(`API URL: ${config.apiBaseUrl}`);
    console.log(`UI URL: ${config.baseUrl}`);
    console.log(`Timeout: ${config.timeout}ms`);
    console.log(`Retries: ${config.retries}`);
    console.log(`Default User: ${config.defaultUser.email}`);
    console.log(`Headless: ${config.headless ? 'Yes' : 'No'}`);
    console.log(`\nRunning in ${env.toUpperCase()} environment by default.`);
    console.log(`To run in a different environment:`);
    console.log(`  UI Tests: cypress run --env name=staging`);
    console.log(`  API Tests: TEST_ENV=staging npm run test:api\n`);
  }
}