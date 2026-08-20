import { ProductFilterParams } from '../types';

export const PRODUCT_QUERY_KEYS = {
  ALL: ['products'] as const,
  LIST: (params?: ProductFilterParams) => [...PRODUCT_QUERY_KEYS.ALL, 'list', params] as const,
  DETAIL: (id: number | string) => [...PRODUCT_QUERY_KEYS.ALL, 'detail', id] as const,
};
