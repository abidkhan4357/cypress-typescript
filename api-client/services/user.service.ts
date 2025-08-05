import { HttpClient } from '../utils/http-client';
import { User, CreateAccountPayload, AuthCredentials, ApiResponse } from '../types/api.types';

export class UserService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async createAccount(userData: CreateAccountPayload): Promise<ApiResponse<any>> {
    const formData = new URLSearchParams();
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await this.httpClient.post('/createAccount', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response;
  }

  async verifyLogin(credentials: AuthCredentials): Promise<ApiResponse<any>> {
    const formData = new URLSearchParams();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    const response = await this.httpClient.post('/verifyLogin', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response;
  }

  async deleteAccount(email: string, password: string): Promise<ApiResponse<any>> {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await this.httpClient.delete('/deleteAccount', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData,
    });

    return response;
  }

  async updateAccount(email: string, userData: Partial<User>): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('email', email);
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await this.httpClient.put('/updateAccount', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }

  async getUserDetailByEmail(email: string): Promise<ApiResponse<User>> {
    const response = await this.httpClient.get('/getUserDetailByEmail', {
      params: { email },
    });

    return response;
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const response = await this.httpClient.get('/getUsersList');
    return response;
  }

  async searchProduct(searchTerm: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('search_product', searchTerm);

    const response = await this.httpClient.post('/searchProduct', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }
}