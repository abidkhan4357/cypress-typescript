export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  title?: 'Mr' | 'Mrs';
  birth_date?: string;
  birth_month?: string;
  birth_year?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  mobile_number?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserRegistrationData extends User {
  confirmPassword?: string;
  newsletter: boolean;
  offers: boolean;
}

export interface ApiUser {
  responseCode: number;
  message: string;
  user?: User;
}

export interface UserPreferences {
  newsletter: boolean;
  offers: boolean;
  theme?: 'light' | 'dark';
  language?: string;
}

export interface UserProfile extends User {
  preferences: UserPreferences;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}