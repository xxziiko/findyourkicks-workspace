import { PATH } from '@/shared';
import { PageLayout } from '@/shared/components';
import { ErrorFallback } from '@findyourkicks/shared';
import { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './features/auth/components/AuthGuard';
import Login from './pages/Login';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));

const router = createBrowserRouter([
  {
    path: PATH.login,
    element: <Login />,
  },
  {
    path: PATH.default,

    element: (
      <AuthGuard>
        <PageLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: PATH.products,
        element: <Products />,
      },
      {
        path: PATH.orders,
        // element: <Orders />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
