import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError, RequestConfig, AuthTokens } from '../types/api.types';

export class HttpClient {
  private client: AxiosInstance;
  private baseURL: string;
  private authTokens: AuthTokens | null = null;
  private defaultTimeout = 30000;

  constructor(baseURL: string, timeout?: number) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: timeout || this.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        if (this.authTokens?.accessToken) {
          config.headers.Authorization = `${this.authTokens.tokenType || 'Bearer'} ${this.authTokens.accessToken}`;
        }
        
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log('Request Data:', config.data);
        console.log('Request Headers:', config.headers);
        
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} - ${response.config.url}`);
        console.log('Response Data:', response.data);
        return response;
      },
      async (error: AxiosError) => {
        console.error(`API Error: ${error.response?.status} - ${error.config?.url}`);
        console.error('Error Response:', error.response?.data);
        
        if (error.response?.status === 401 && this.authTokens?.refreshToken) {
          try {
            await this.refreshToken();
            if (error.config) {
              return this.client.request(error.config);
            }
          } catch (refreshError) {
            this.clearTokens();
            throw this.handleError(error);
          }
        }
        
        throw this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    const status = error.response?.status || 500;
    const message = this.extractErrorMessage(error);
    
    return {
      message,
      status,
      code: error.code,
      details: error.response?.data,
    };
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errors && Array.isArray(data.errors)) return data.errors.join(', ');
    }
    
    return error.message || 'An unexpected error occurred';
  }

  setAuthTokens(tokens: AuthTokens): void {
    this.authTokens = tokens;
  }

  clearTokens(): void {
    this.authTokens = null;
  }

  getAuthTokens(): AuthTokens | null {
    return this.authTokens;
  }

  private async refreshToken(): Promise<void> {
    if (!this.authTokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.client.post('/auth/refresh', {
      refreshToken: this.authTokens.refreshToken,
    });

    if (response.data.accessToken) {
      this.setAuthTokens({
        ...this.authTokens,
        accessToken: response.data.accessToken,
      });
    }
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, this.buildConfig(config));
    return this.formatResponse(response);
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, this.buildConfig(config));
    return this.formatResponse(response);
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, this.buildConfig(config));
    return this.formatResponse(response);
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, this.buildConfig(config));
    return this.formatResponse(response);
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const axiosConfig = this.buildConfig(config);
    const response = await this.client.delete<T>(url, axiosConfig);
    return this.formatResponse(response);
  }

  async head(url: string, config?: RequestConfig): Promise<ApiResponse<any>> {
    const response = await this.client.head(url, this.buildConfig(config));
    return this.formatResponse(response);
  }

  async options(url: string, config?: RequestConfig): Promise<ApiResponse<any>> {
    const response = await this.client.options(url, this.buildConfig(config));
    return this.formatResponse(response);
  }

  private buildConfig(config?: RequestConfig): AxiosRequestConfig {
    const axiosConfig: AxiosRequestConfig = {};
    
    if (config?.timeout) axiosConfig.timeout = config.timeout;
    if (config?.headers) axiosConfig.headers = { ...axiosConfig.headers, ...config.headers };
    if (config?.params) axiosConfig.params = config.params;
    if (config?.data) axiosConfig.data = config.data;
    
    return axiosConfig;
  }

  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      success: response.status >= 200 && response.status < 300,
      message: response.statusText,
    };
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.client.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.client.defaults.headers, headers);
  }
}