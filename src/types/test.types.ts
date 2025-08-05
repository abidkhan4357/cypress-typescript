export interface TestConfig {
  environment: 'development' | 'staging' | 'production';
  baseUrl: string;
  apiUrl: string;
  browser: string;
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  timeouts: {
    default: number;
    request: number;
    response: number;
    pageLoad: number;
  };
  retries: {
    runMode: number;
    openMode: number;
  };
}

export interface TestData {
  id: string;
  description: string;
  data: Record<string, any>;
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface TestResult {
  testId: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  duration: number;
  error?: string;
  screenshots?: string[];
  videos?: string[];
  logs?: string[];
}

export interface PageElement {
  selector: string;
  description: string;
  type: 'button' | 'input' | 'text' | 'link' | 'dropdown' | 'checkbox' | 'radio' | 'image';
  required: boolean;
  timeout?: number;
}

export interface PageElements {
  [key: string]: PageElement;
}

export interface WaitCondition {
  type: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'exist' | 'not.exist' | 'contain' | 'have.value';
  selector?: string;
  text?: string;
  value?: string;
  timeout?: number;
}