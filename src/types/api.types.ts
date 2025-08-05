export interface ApiResponse<T = any> {
  responseCode: number;
  message: string;
  data?: T;
}

export interface ApiError {
  responseCode: number;
  message: string;
  error?: string;
  details?: Record<string, any>;
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}

export interface ApiTestContext {
  baseUrl: string;
  headers: Record<string, string>;
  timeout: number;
  retries: number;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'number' | 'string' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requiresAuth: boolean;
  validation?: {
    request?: ValidationRule[];
    response?: ValidationRule[];
  };
  rateLimit?: {
    requests: number;
    window: number; // in seconds
  };
}