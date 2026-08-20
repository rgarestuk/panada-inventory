import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ProfilePage } from '@/features/auth/pages/ProfilePage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ProductListPage } from '@/features/products/pages/ProductListPage';
import { CategoryListPage } from '@/features/categories/pages/CategoryListPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public / Guest Only Routes */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Default Root Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
