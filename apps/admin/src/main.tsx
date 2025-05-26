import { Routes } from '@/routes';
import { ErrorBoundary, GlobalPortal } from '@findyourkicks/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OverlayProvider } from 'overlay-kit';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@findyourkicks/shared/styles/global.scss';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalPortal.Provider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={null}>
            <OverlayProvider>
              <Routes />
            </OverlayProvider>
          </Suspense>
        </QueryClientProvider>
      </ErrorBoundary>
    </GlobalPortal.Provider>
  </StrictMode>,
);
