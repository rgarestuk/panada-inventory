import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/features/auth/types';
import { authRepository } from '@/features/auth/repository/auth.repository';
import { authService } from '@/features/auth/services/auth.service';
import { storageService } from '@/shared/services/storage.service';
import { queryClient } from '@/shared/lib/queryClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    if (!storageService.getToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authRepository.getCurrentUser();
      setUser(currentUser);
      storageService.setUser(currentUser);
    } catch {
      authService.handleLogout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!storageService.getToken()) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authRepository.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          storageService.setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          authService.handleLogout();
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authRepository.login(credentials);
    authService.handleAuthSuccess(response);
    setUser(response.user);
    queryClient.clear();
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await authRepository.register(credentials);
    authService.handleAuthSuccess(response);
    setUser(response.user);
    queryClient.clear();
  };

  const logout = async () => {
    try {
      if (storageService.getToken()) {
        await authRepository.logout();
      }
    } catch {
    } finally {
      authService.handleLogout();
      setUser(null);
      queryClient.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
