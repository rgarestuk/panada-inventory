import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <Outlet />
    </div>
  );
};
