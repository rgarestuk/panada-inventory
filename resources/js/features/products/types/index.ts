import { Category } from '@/features/categories/types';
import { User } from '@/features/auth/types';

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface StockMutation {
  id: number;
  product_id: number;
  product?: Product;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previous_stock: number;
  current_stock: number;
  notes: string | null;
  user?: User;
  created_at: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category_id: number | null;
  category?: Category;
  purchase_price: number;
  selling_price: number;
  stock: number;
  min_stock: number;
  unit: string;
  description: string | null;
  status: ProductStatus;
  total_value: number;
  stock_mutations?: StockMutation[];
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  sku: string;
  name: string;
  category_id?: number | string | null;
  purchase_price: number;
  selling_price: number;
  stock?: number;
  min_stock: number;
  unit: string;
  description?: string;
}

export interface StockAdjustmentInput {
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  notes?: string;
}

export interface ProductFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string | number;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
