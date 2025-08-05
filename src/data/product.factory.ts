import { faker } from '@faker-js/faker';
import { BaseFactory, FactoryBuilder } from './base.factory';
import { Product, ProductCategory, ProductReview, Cart, CartItem, ProductFilters, ProductSearchParams } from '@types/product.types';

export class ProductCategoryFactory extends BaseFactory<ProductCategory> {
  protected createDefault(): ProductCategory {
    return {
      id: faker.number.int({ min: 1, max: 100 }),
      name: faker.commerce.department(),
      subcategories: []
    };
  }

  createWithSubcategories(subcategoryCount: number = 3): ProductCategory {
    const category = this.createDefault();
    category.subcategories = Array.from({ length: subcategoryCount }, () => ({
      id: faker.number.int({ min: 101, max: 200 }),
      name: faker.commerce.productName(),
      parent: category
    }));
    return category;
  }

  createClothingCategory(): ProductCategory {
    return this.create({
      name: 'Clothing',
      subcategories: [
        { id: 1, name: 'Men', subcategories: [] },
        { id: 2, name: 'Women', subcategories: [] },
        { id: 3, name: 'Kids', subcategories: [] }
      ]
    });
  }

  static builder(): FactoryBuilder<ProductCategory> {
    return new FactoryBuilder(new ProductCategoryFactory());
  }
}

export class ProductReviewFactory extends BaseFactory<ProductReview> {
  protected createDefault(): ProductReview {
    return {
      id: faker.number.int({ min: 1, max: 10000 }),
      userId: faker.number.int({ min: 1, max: 1000 }),
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      createdAt: faker.date.past(),
      verified: faker.datatype.boolean()
    };
  }

  createPositiveReview(): ProductReview {
    return this.create({
      rating: faker.number.int({ min: 4, max: 5 }),
      comment: faker.helpers.arrayElement([
        'Great product! Highly recommended.',
        'Excellent quality and fast shipping.',
        'Perfect fit and beautiful design.',
        'Amazing value for money.',
        'Love it! Will buy again.'
      ])
    });
  }

  createNegativeReview(): ProductReview {
    return this.create({
      rating: faker.number.int({ min: 1, max: 2 }),
      comment: faker.helpers.arrayElement([
        'Poor quality, not as described.',
        'Disappointed with the purchase.',
        'Cheap material and bad fit.',
        'Would not recommend this product.',
        'Waste of money.'
      ])
    });
  }

  static builder(): FactoryBuilder<ProductReview> {
    return new FactoryBuilder(new ProductReviewFactory());
  }
}

export class ProductFactory extends BaseFactory<Product> {
  private categoryFactory = new ProductCategoryFactory();
  private reviewFactory = new ProductReviewFactory();

  protected createDefault(): Product {
    const category = this.categoryFactory.createDefault();
    const reviewCount = faker.number.int({ min: 0, max: 10 });
    const reviews = this.reviewFactory.createMany(reviewCount);
    
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      brand: faker.company.name(),
      category,
      description: faker.commerce.productDescription(),
      images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
        faker.image.url({ width: 400, height: 400 })
      ),
      availability: this.getRandomFromArray(['In Stock', 'Out of Stock']),
      rating: reviews.length > 0 ? 
        parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)) : 
        0,
      reviews
    };
  }

  createInStockProduct(): Product {
    return this.create({
      availability: 'In Stock'
    });
  }

  createOutOfStockProduct(): Product {
    return this.create({
      availability: 'Out of Stock'
    });
  }

  createHighRatedProduct(): Product {
    const positiveReviews = this.reviewFactory.createMany(5, { rating: 5 });
    return this.create({
      rating: 5.0,
      reviews: positiveReviews,
      availability: 'In Stock'
    });
  }

  createLowRatedProduct(): Product {
    const negativeReviews = this.reviewFactory.createMany(3, { rating: 1 });
    return this.create({
      rating: 1.0,
      reviews: negativeReviews
    });
  }

  createExpensiveProduct(): Product {
    return this.create({
      price: faker.number.float({ min: 500, max: 2000, fractionDigits: 2 })
    });
  }

  createCheapProduct(): Product {
    return this.create({
      price: faker.number.float({ min: 1, max: 50, fractionDigits: 2 })
    });
  }

  createClothingProduct(): Product {
    const clothingCategory = this.categoryFactory.createClothingCategory();
    return this.create({
      category: clothingCategory,
      name: faker.helpers.arrayElement([
        'Cotton T-Shirt',
        'Denim Jeans',
        'Summer Dress',
        'Leather Jacket',
        'Running Shoes'
      ])
    });
  }

  static builder(): FactoryBuilder<Product> {
    return new FactoryBuilder(new ProductFactory());
  }
}

export class CartItemFactory extends BaseFactory<CartItem> {
  private productFactory = new ProductFactory();

  protected createDefault(): CartItem {
    const product = this.productFactory.createInStockProduct();
    const quantity = faker.number.int({ min: 1, max: 5 });
    
    return {
      product,
      quantity,
      price: product.price,
      totalPrice: product.price * quantity
    };
  }

  createMultipleQuantity(): CartItem {
    const quantity = faker.number.int({ min: 2, max: 10 });
    const product = this.productFactory.createInStockProduct();
    
    return this.create({
      product,
      quantity,
      totalPrice: product.price * quantity
    });
  }

  createSingleQuantity(): CartItem {
    const product = this.productFactory.createInStockProduct();
    
    return this.create({
      product,
      quantity: 1,
      totalPrice: product.price
    });
  }

  static builder(): FactoryBuilder<CartItem> {
    return new FactoryBuilder(new CartItemFactory());
  }
}

export class CartFactory extends BaseFactory<Cart> {
  private cartItemFactory = new CartItemFactory();

  protected createDefault(): Cart {
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const items = this.cartItemFactory.createMany(itemCount);
    
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = parseFloat((subtotal * 0.08).toFixed(2)); // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));
    
    return {
      items,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax,
      shipping,
      total
    };
  }

  createEmptyCart(): Cart {
    return {
      items: [],
      totalQuantity: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    };
  }

  createSingleItemCart(): Cart {
    const item = this.cartItemFactory.createDefault();
    const subtotal = item.totalPrice;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const shipping = subtotal > 100 ? 0 : 10;
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));
    
    return {
      items: [item],
      totalQuantity: item.quantity,
      subtotal,
      tax,
      shipping,
      total
    };
  }

  createLargeCart(): Cart {
    const itemCount = faker.number.int({ min: 10, max: 20 });
    const items = this.cartItemFactory.createMany(itemCount);
    
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const shipping = 0; // Free shipping for large orders
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));
    
    return {
      items,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax,
      shipping,
      total
    };
  }

  static builder(): FactoryBuilder<Cart> {
    return new FactoryBuilder(new CartFactory());
  }
}

export class ProductFiltersFactory extends BaseFactory<ProductFilters> {
  protected createDefault(): ProductFilters {
    return {
      category: faker.commerce.department(),
      brand: faker.company.name(),
      priceRange: {
        min: faker.number.int({ min: 0, max: 100 }),
        max: faker.number.int({ min: 101, max: 1000 })
      },
      availability: this.getRandomFromArray(['In Stock', 'Out of Stock']),
      rating: faker.number.int({ min: 1, max: 5 })
    };
  }

  createPriceRangeFilter(min: number, max: number): ProductFilters {
    return this.create({
      priceRange: { min, max }
    });
  }

  createCategoryFilter(category: string): ProductFilters {
    return this.create({
      category
    });
  }

  createInStockFilter(): ProductFilters {
    return this.create({
      availability: 'In Stock'
    });
  }

  static builder(): FactoryBuilder<ProductFilters> {
    return new FactoryBuilder(new ProductFiltersFactory());
  }
}

export class ProductSearchParamsFactory extends BaseFactory<ProductSearchParams> {
  private filtersFactory = new ProductFiltersFactory();

  protected createDefault(): ProductSearchParams {
    const filters = this.filtersFactory.createDefault();
    
    return {
      ...filters,
      query: faker.commerce.productName(),
      sortBy: this.getRandomFromArray(['name', 'price', 'rating', 'newest']),
      sortOrder: this.getRandomFromArray(['asc', 'desc']),
      page: 1,
      limit: faker.number.int({ min: 10, max: 50 })
    };
  }

  createBasicSearch(query: string): ProductSearchParams {
    return this.create({
      query,
      page: 1,
      limit: 20
    });
  }

  createSortedSearch(sortBy: ProductSearchParams['sortBy'], sortOrder: ProductSearchParams['sortOrder']): ProductSearchParams {
    return this.create({
      sortBy,
      sortOrder
    });
  }

  static builder(): FactoryBuilder<ProductSearchParams> {
    return new FactoryBuilder(new ProductSearchParamsFactory());
  }
}

// Convenience exports
export const productCategoryFactory = new ProductCategoryFactory();
export const productReviewFactory = new ProductReviewFactory();
export const productFactory = new ProductFactory();
export const cartItemFactory = new CartItemFactory();
export const cartFactory = new CartFactory();
export const productFiltersFactory = new ProductFiltersFactory();
export const productSearchParamsFactory = new ProductSearchParamsFactory();