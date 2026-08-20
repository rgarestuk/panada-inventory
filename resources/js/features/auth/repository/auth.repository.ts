import apiClient from '@/shared/api/axios';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, credentials);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return response.data.user;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};
