// Base factory exports
export * from './base.factory';

// User factory exports
export * from './user.factory';

// Product factory exports
export * from './product.factory';

// Convenience object for easy access to all factories
export const factories = {
  user: {
    user: () => import('./user.factory').then(m => m.userFactory),
    registration: () => import('./user.factory').then(m => m.userRegistrationFactory),
    credentials: () => import('./user.factory').then(m => m.loginCredentialsFactory),
    profile: () => import('./user.factory').then(m => m.userProfileFactory)
  },
  product: {
    product: () => import('./product.factory').then(m => m.productFactory),
    category: () => import('./product.factory').then(m => m.productCategoryFactory),
    review: () => import('./product.factory').then(m => m.productReviewFactory),
    cart: () => import('./product.factory').then(m => m.cartFactory),
    cartItem: () => import('./product.factory').then(m => m.cartItemFactory),
    filters: () => import('./product.factory').then(m => m.productFiltersFactory),
    searchParams: () => import('./product.factory').then(m => m.productSearchParamsFactory)
  }
};