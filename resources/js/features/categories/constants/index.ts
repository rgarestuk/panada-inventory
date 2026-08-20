export const CATEGORY_QUERY_KEYS = {
  ALL: ['categories'] as const,
  LIST: () => [...CATEGORY_QUERY_KEYS.ALL, 'list'] as const,
  DETAIL: (id: number | string) => [...CATEGORY_QUERY_KEYS.ALL, 'detail', id] as const,
};
