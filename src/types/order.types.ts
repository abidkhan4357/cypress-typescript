import { CartItem } from './product.types';
import { User } from './user.types';

export interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  method: 'Standard' | 'Express' | 'Overnight';
  cost: number;
}

export interface PaymentInfo {
  method: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Bank Transfer';
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  nameOnCard?: string;
  billingAddress?: ShippingInfo;
}

export type OrderStatus = 
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderHistory {
  orders: Order[];
  totalOrders: number;
  totalSpent: number;
}

export interface CheckoutData {
  user: User;
  shipping: ShippingInfo;
  payment: PaymentInfo;
  items: CartItem[];
  total: number;
}