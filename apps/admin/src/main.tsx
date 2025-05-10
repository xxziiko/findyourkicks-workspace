import { Routes } from '@/routes';
import { ErrorBoundary, GlobalPortal } from '@findyourkicks/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@findyourkicks/shared/styles/global.scss';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GlobalPortal.Provider>
          <Suspense fallback={null}>
            <Routes />
          </Suspense>
        </GlobalPortal.Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
