// App Constants
export const APP_NAME = 'NetworkTask';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  CART: 'cart-storage',
  NOTIFICATIONS: 'notifications-storage',
  LANGUAGE: 'language-storage',
  SETTINGS: 'settings-storage',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  PROMOTION: 'promotion',
  ORDER: 'order',
  GENERAL: 'general',
} as const;

// Languages
export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
} as const;

// Default Values
export const DEFAULTS = {
  LANGUAGE: LANGUAGES.EN,
  NOTIFICATION_DURATION: 2500,
  CART_BADGE_THRESHOLD: 0,
} as const;

// API Endpoints (if needed in future)
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_USERNAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100,
} as const;
