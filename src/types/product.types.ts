export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: ProductCategory;
  description?: string;
  images?: string[];
  availability: 'In Stock' | 'Out of Stock';
  rating?: number;
  reviews?: ProductReview[];
}

export interface ProductCategory {
  id: number;
  name: string;
  parent?: ProductCategory;
  subcategories?: ProductCategory[];
}

export interface ProductReview {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: 'In Stock' | 'Out of Stock';
  rating?: number;
}

export interface ProductSearchParams extends ProductFilters {
  query?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}