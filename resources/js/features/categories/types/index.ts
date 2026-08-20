export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
}
