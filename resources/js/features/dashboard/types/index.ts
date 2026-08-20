import { Product, StockMutation } from '@/features/products/types';

export interface DashboardOverview {
  total_products: number;
  total_categories: number;
  total_inventory_value: number;
  total_selling_potential: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  low_stock_items: Product[];
  recent_products: Product[];
  recent_mutations: StockMutation[];
}
