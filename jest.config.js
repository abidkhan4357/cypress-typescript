module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/api-spec'],
  testMatch: [
    '**/api-spec/**/*.spec.ts',
    '**/api-spec/**/*.test.ts'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'api-client/**/*.{ts,tsx}',
    '!api-client/**/*.d.ts',
    '!api-client/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/api-spec/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  verbose: true,
  bail: false,
  maxWorkers: 4,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/',
    '/dist/',
    '/build/'
  ],
  collectCoverage: false,
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: 'reports/jest-html',
      filename: 'report.html',
      openReport: false,
      expand: true,
      pageTitle: 'API Test Report',
      logoImgPath: undefined,
      hideIcon: true,
      includeFailureMsg: true,
      includeSuiteFailure: true,
      includeConsoleLog: true
    }]
  ]
};