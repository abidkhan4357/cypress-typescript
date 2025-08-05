import { defineConfig } from 'cypress';
import { EnvironmentLoader } from './config/environment.loader';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Dynamically load environment configuration
      const environment = config.env?.name || process.env.TEST_ENV || process.env.CYPRESS_ENV || 'qa';
      const envConfig = EnvironmentLoader.createConfigForCypress(environment);
      
      // Print environment info
      EnvironmentLoader.printEnvironmentInfo(environment);
      
      // Merge environment config with base config
      Object.assign(config, envConfig);
      
      // Set additional config based on environment
      config.supportFile = 'cypress/support/e2e.ts';
      config.specPattern = 'cypress/e2e/**/*.cy.ts';
      config.fixturesFolder = 'cypress/fixtures';
      config.screenshotsFolder = 'cypress/screenshots';
      config.videosFolder = 'cypress/videos';
      config.downloadsFolder = 'cypress/downloads';
      config.testIsolation = true;
      
      // Force headed mode if environment config says not headless
      const envHeadless = envConfig.env.headless;
      if (!envHeadless && !config.isInteractive) {
        // For cypress run command, we need to warn about headed mode
        console.log(`Warning: ${environment.toUpperCase()} environment is configured for headed mode.`);
        console.log(`Use: cypress run --headed --env name=${environment} or npm run test:ui:${environment}`);
      }
      // Code coverage
      require('@cypress/code-coverage/task')(on, config);
      
      // Grep support
      require('@cypress/grep/src/plugin')(config);
      
      // Custom tasks
      on('task', {
        log(message: string) {
          console.log(message);
          return null;
        },
        
        clearDownloads() {
          const fs = require('fs');
          const path = require('path');
          const downloadsFolder = config.downloadsFolder;
          
          if (fs.existsSync(downloadsFolder)) {
            fs.readdirSync(downloadsFolder).forEach((file: string) => {
              fs.unlinkSync(path.join(downloadsFolder, file));
            });
          }
          return null;
        },
        
        setEnvironment(env: string) {
          try {
            EnvironmentLoader.setEnvironment(env);
            return { success: true, environment: env };
          } catch (error) {
            return { success: false, error: error.message };
          }
        },
        
        getEnvironmentConfig() {
          return EnvironmentLoader.getCurrentConfig();
        },
        
        getAvailableEnvironments() {
          return EnvironmentLoader.getAvailableEnvironments();
        },
        
        generateTestData(dataType: string) {
          const { faker } = require('@faker-js/faker');
          
          switch (dataType) {
            case 'user':
              return {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 12 }),
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                zipCode: faker.location.zipCode(),
                country: 'United States'
              };
            default:
              return {};
          }
        }
      });
      
      return config;
    },
    
    env: {
      coverage: false,
      grepFilterSpecs: true,
      grepOmitFiltered: true
    }
  },
  
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
  
  // Global reporter configuration
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'config/reporter.config.json',
  },
});