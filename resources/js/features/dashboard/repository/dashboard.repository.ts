import apiClient from '@/shared/api/axios';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';
import { DashboardStats } from '../types';

export const dashboardRepository = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
    return response.data;
  },
};
