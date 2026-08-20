import { storageService } from '@/shared/services/storage.service';
import { AuthResponse, User } from '../types';

export const authService = {
  handleAuthSuccess(response: AuthResponse): void {
    storageService.setToken(response.token);
    storageService.setUser(response.user);
  },

  handleLogout(): void {
    storageService.clearAuth();
  },

  getStoredUser(): User | null {
    return storageService.getUser<User>();
  },

  isAuthenticated(): boolean {
    return Boolean(storageService.getToken());
  },
};
