## Project Overview

This framework implements a complete separation of concerns between UI testing (Cypress) and API testing (Jest/Node.js), featuring design patterns, environment management, and reporting capabilities.

### Key Architecture Decisions

**Separation of Testing Concerns:**
- **UI Testing**: Cypress for end-to-end user interface testing
- **API Testing**: Jest with Axios for comprehensive API validation
- **Independent Execution**: Each testing layer can run independently or together

**Design Patterns:**
- **Page Object Model**: Structured page representations with reusable methods
- **Factory Pattern**: Dynamic test data generation and management
- **Strategy Pattern**: Environment-specific configuration handling
- **Singleton Pattern**: Centralized API client management

## Technology Stack

- **Cypress**: v14.5.3 - Modern end-to-end testing framework
- **TypeScript**: v5.5.2 - Type-safe JavaScript with advanced IDE support
- **Jest**: v30.0.5 - JavaScript testing framework for API tests
- **Axios**: v1.7.2 - Promise-based HTTP client for API calls
- **Node.js**: v18+ - JavaScript runtime environment

## Project Structure

```
cypress-typescript/
├── api-client/                 # API testing infrastructure
│   ├── data/                   # Test data factories and builders
│   ├── services/              # API service layer implementations
│   ├── types/                 # TypeScript interface definitions
│   └── utils/                 # HTTP client and utilities
├── api-spec/                  # API test specifications
│   ├── login/                 # Authentication API tests
│   └── user-account/          # User management API tests
├── config/                    # Environment and reporter configurations
├── cypress/                   # UI testing framework
│   ├── data/                  # UI test data factories
│   ├── e2e/                   # End-to-end test specifications
│   ├── fixtures/              # Static test data files
│   ├── pages/                 # Page Object Model implementations
│   └── support/               # Cypress commands and utilities
└── reports/                   # Generated test reports (gitignored)
```

## Environment Configuration

The framework supports multiple testing environments with centralized configuration:

**Available Environments:**
- **QA**: Development testing environment (headed mode)
- **CI**: Continuous integration environment (headless mode)
- **Staging**: Pre-production testing environment (headless mode)
- **Production**: Production environment testing (headless mode)

Environment settings are managed in `config/environment.json` and include:
- Base URLs for UI and API endpoints
- Timeout and retry configurations
- Default user credentials
- Browser execution modes (headed/headless)

## Installation and Setup

```bash
# Clone the repository
git clone <repository-url>
cd cypress-typescript

# Install dependencies
npm install

# Verify installation
npm run lint
```

## Running Tests

### API Tests (Jest)

```bash
# Run API tests in default QA environment
npm run test:api

# Run API tests in specific environments
npm run test:api:qa
npm run test:api:staging
npm run test:api:prod
```

### UI Tests (Cypress)

```bash
# Run UI tests in default QA environment
npm run test:ui

# Run UI tests in specific environments
npm run test:ui:qa        # Headed mode (browser visible)
npm run test:ui:staging   # Headless mode
npm run test:ui:prod      # Headless mode

# Open Cypress Test Runner for interactive testing
npm run open:qa
npm run open:staging
```

### Combined Test Execution

```bash
# Run both API and UI tests
npm run test

# Run complete test suite for specific environment
npm run test:qa
npm run test:staging
npm run test:prod
```

### Advanced Command Line Usage

```bash
# Cypress with environment selection
npx cypress run --env name=staging
npx cypress open --env name=qa

# Jest with environment variables
TEST_ENV=staging npm run test:api
```

## Test Reports

The framework generates comprehensive HTML reports for both API and UI tests:

### Viewing Reports

```bash
# Display report locations
npm run report

# Reports are available at:
# API Report: reports/jest-html/report.html
# UI Report: reports/cypress-html/report.html
```

### Report Features
- API Reports (Jest HTML)
- UI Reports (Cypress Mochawesome)

## Advanced Features

### Authentication Management
- Consistent login flow management across test suites
- Reusable authentication patterns in Page Object Model
- Environment-specific user credential management

### Test Data Management
- Factory pattern implementation for dynamic test data generation
- Fixture-based static data management for consistent test scenarios
- Environment-specific test data configuration

### Custom Commands
- Reusable Cypress commands for common UI interactions
- Chainable command patterns for fluent test writing

### API Client Architecture
- Centralized HTTP client with automatic request/response logging
- Form-data encoding for API compatibility
- Comprehensive error handling and retry mechanisms
- Environment-aware base URL configuration

### Testing Best Practices
- Page Object Model for maintainable UI tests
- Clear separation between test data and test logic
- Comprehensive error handling and logging
- Environment-specific configuration management

## Maintenance Commands

```bash
# Clean all test artifacts and reports
npm run clean

# Merge Cypress reports manually (if needed)
npm run report:merge
```
