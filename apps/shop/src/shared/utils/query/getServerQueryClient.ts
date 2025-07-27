import { QueryClient } from '@tanstack/react-query';

let serverQueryClient: QueryClient | null = null;

export const getServerQueryClient = () => {
  if (!serverQueryClient) {
    serverQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1분
          gcTime: 5 * 60 * 1000, // 5분
          retry: false,
        },
      },
    });
  }

  return serverQueryClient;
};
