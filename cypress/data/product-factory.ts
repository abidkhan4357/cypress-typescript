import { faker } from '@faker-js/faker';

export interface ProductData {
  id?: number;
  name: string;
  price: string;
  category: string;
  brand: string;
  availability: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  price: string;
  totalPrice: string;
}

export class ProductFactory {
  private static instance: ProductFactory;

  static getInstance(): ProductFactory {
    if (!ProductFactory.instance) {
      ProductFactory.instance = new ProductFactory();
    }
    return ProductFactory.instance;
  }

  createRandomProduct(): ProductData {
    const categories = ['Women > Tops', 'Men > Tshirts', 'Women > Dress', 'Men > Jeans', 'Kids > Dress'];
    const brands = ['Polo', 'H&M', 'Madame', 'Mast & Harbour', 'Babyhug'];
    
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.commerce.productName(),
      price: `Rs. ${faker.number.int({ min: 300, max: 2000 })}`,
      category: faker.helpers.arrayElement(categories),
      brand: faker.helpers.arrayElement(brands),
      availability: faker.helpers.arrayElement(['In Stock', 'Out of Stock']),
      description: faker.commerce.productDescription(),
    };
  }


  // Get all products via API
  getAllProductListByApi(): Cypress.Chainable<ProductData[]> {
    return cy.request('GET', '/api/productsList').then((response) => {
      expect(response.status).to.eq(200);
      return response.body.products || [
        { name: 'Blue Top', price: 'Rs. 500', id: 1 },
        { name: 'Men Tshirt', price: 'Rs. 400', id: 2 }
      ];
    });
  }

  createCartItem(product: ProductData, quantity: number = 1): CartItem {
    const price = parseFloat(product.price.replace(/[^\d.]/g, ''));
    const totalPrice = price * quantity;
    
    return {
      productId: product.id || faker.number.int({ min: 1, max: 100 }),
      quantity,
      price: product.price,
      totalPrice: `Rs. ${totalPrice}`,
    };
  }

  createSearchTerms(): { valid: string[], invalid: string[], special: string[] } {
    return {
      valid: ['top', 'dress', 'shirt', 'jean', 'polo'],
      invalid: ['nonexistent', 'xyz123', 'abcdefghijk'],
      special: ['@#$%', 'test123', '', '   ']
    };
  }

  createProductWithDiscount(): ProductData {
    const baseProduct = this.createRandomProduct();
    const originalPrice = faker.number.int({ min: 1000, max: 3000 });
    const discountPercent = faker.number.int({ min: 10, max: 50 });
    const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);
    
    return {
      ...baseProduct,
      price: `Rs. ${discountedPrice}`,
      description: `${baseProduct.description} - ${discountPercent}% OFF`,
    };
  }

  createBulkProducts(count: number): ProductData[] {
    return Array.from({ length: count }, () => this.createRandomProduct());
  }

  getProductCategories(): string[] {
    return [
      'Women > Dress',
      'Women > Tops', 
      'Women > Saree',
      'Men > Tshirts',
      'Men > Jeans',
      'Kids > Dress',
      'Kids > Tops & Shirts'
    ];
  }

  getProductBrands(): string[] {
    return [
      'Polo',
      'H&M',
      'Madame',
      'Mast & Harbour',
      'Babyhug',
      'Allen Solly Junior'
    ];
  }

  createProductFilters(): {
    categories: string[];
    brands: string[];
    priceRanges: { min: number; max: number; label: string }[];
  } {
    return {
      categories: this.getProductCategories(),
      brands: this.getProductBrands(),
      priceRanges: [
        { min: 0, max: 500, label: 'Under Rs. 500' },
        { min: 500, max: 1000, label: 'Rs. 500 - Rs. 1000' },
        { min: 1000, max: 2000, label: 'Rs. 1000 - Rs. 2000' },
        { min: 2000, max: 5000, label: 'Above Rs. 2000' }
      ]
    };
  }

  createProductReview(): {
    rating: number;
    title: string;
    comment: string;
    reviewer: string;
  } {
    return {
      rating: faker.number.int({ min: 1, max: 5 }),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      comment: faker.lorem.paragraph({ min: 2, max: 5 }),
      reviewer: faker.person.fullName(),
    };
  }
}

export const productFactory = ProductFactory.getInstance();