class Logger {
  private isBrowser = typeof window !== 'undefined';

  constructor() {
    // Simple logger for Cypress browser environment
  }

  private getLogLevel(): string {
    if (typeof Cypress !== 'undefined') {
      return Cypress.env('debugMode') ? 'debug' : 'info';
    }
    return process.env.LOG_LEVEL || 'info';
  }

  info(message: string, meta?: any): void {
    console.log(`[INFO] ${message}`, meta);
    if (typeof cy !== 'undefined') {
      cy.task('log', `[INFO] ${message}`);
    }
  }

  error(message: string, error?: Error | any): void {
    console.error(`[ERROR] ${message}`, error);
    if (typeof cy !== 'undefined') {
      cy.task('log', `[ERROR] ${message}`);
    }
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${message}`, meta);
    if (typeof cy !== 'undefined') {
      cy.task('log', `[WARN] ${message}`);
    }
  }

  debug(message: string, meta?: any): void {
    console.debug(`[DEBUG] ${message}`, meta);
    if (typeof cy !== 'undefined') {
      cy.task('log', `[DEBUG] ${message}`);
    }
  }

  step(stepName: string, action?: () => void): void {
    this.info(`Step: ${stepName}`);
    if (action) {
      try {
        action();
        this.info(`Step completed: ${stepName}`);
      } catch (error) {
        this.error(`Step failed: ${stepName}`, error);
        throw error;
      }
    }
  }

  testStart(testName: string): void {
    this.info(`Test started: ${testName}`);
  }

  testEnd(testName: string, status: 'passed' | 'failed'): void {
    if (status === 'passed') {
      this.info(`Test passed: ${testName}`);
    } else {
      this.error(`Test failed: ${testName}`);
    }
  }

  apiRequest(method: string, url: string, status?: number): void {
    this.info(`API ${method} ${url} - Status: ${status || 'pending'}`);
  }

  pageAction(action: string, element?: string): void {
    const elementInfo = element ? ` on ${element}` : '';
    this.info(`Page action: ${action}${elementInfo}`);
  }
}

export const logger = new Logger();