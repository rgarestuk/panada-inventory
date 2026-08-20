export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
