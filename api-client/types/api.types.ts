export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status: number;
  success: boolean;
  responseCode?: number;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  mobile?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  brand?: string;
  category?: string;
  description?: string;
  image?: string;
  availability?: boolean;
}

export interface CreateAccountPayload extends User {
  password: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  address1: string;
  address2?: string;
  mobile_number: string;
}