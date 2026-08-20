import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401 || status === 404 || status === 422) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 2,
    },
    mutations: {
      retry: false,
    },
  },
});
