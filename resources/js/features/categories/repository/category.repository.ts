import apiClient from '@/shared/api/axios';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api';
import { Category, CategoryInput } from '../types';

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data.data;
  },

  async getById(id: number | string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.DETAIL(id));
    return response.data.data;
  },

  async create(data: CategoryInput): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.BASE, data);
    return response.data.data;
  },

  async update(id: number | string, data: CategoryInput): Promise<Category> {
    const response = await apiClient.put<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.DETAIL(id), data);
    return response.data.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.DETAIL(id));
  },
};
