import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export const GuestRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner label="Memuat..." className="text-white" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
