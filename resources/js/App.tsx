import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/shared/lib/queryClient';
import { ToastProvider } from '@/app/providers/ToastProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;
