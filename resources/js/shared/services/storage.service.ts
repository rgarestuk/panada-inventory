import { STORAGE_KEYS } from '../constants/storage';

export const storageService = {
  getToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  },

  setToken(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (e) {
      console.error('Failed to set auth token in localStorage', e);
    }
  },

  removeToken(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (e) {
      console.error('Failed to remove auth token from localStorage', e);
    }
  },

  getUser<T>(): T | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  },

  setUser<T>(user: T): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to set user in localStorage', e);
    }
  },

  removeUser(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error('Failed to remove user from localStorage', e);
    }
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },
};
