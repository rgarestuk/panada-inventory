import apiClient from '@/shared/api/axios';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import { Product, ProductFilterParams, ProductInput, StockAdjustmentInput } from '../types';

export const productRepository = {
  async getAll(params?: ProductFilterParams): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.BASE, {
      params,
    });
    return response.data;
  },

  async getById(id: number | string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return response.data.data;
  },

  async create(data: ProductInput): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.BASE, data);
    return response.data.data;
  },

  async update(id: number | string, data: ProductInput): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id), data);
    return response.data.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  },

  async adjustStock(id: number | string, data: StockAdjustmentInput): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.STOCK(id), data);
    return response.data.data;
  },
};
