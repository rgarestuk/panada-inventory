export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
  },
  CATEGORIES: {
    BASE: '/api/categories',
    DETAIL: (id: number | string) => `/api/categories/${id}`,
  },
  PRODUCTS: {
    BASE: '/api/products',
    DETAIL: (id: number | string) => `/api/products/${id}`,
    STOCK: (id: number | string) => `/api/products/${id}/stock`,
  },
} as const;
