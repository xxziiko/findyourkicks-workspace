import { PATH } from '@/shared';
import { PageLayout } from '@/shared/components';
import { Loading } from '@/shared/components';
import { ErrorFallback } from '@findyourkicks/shared';
import { lazy } from 'react';
import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './features/auth/components/AuthGuard';

const Login = lazy(() => import('./pages/Login'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductRegister = lazy(() => import('./pages/ProductRegister'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    path: PATH.login,
    element: <Login />,
    errorElement: <ErrorFallback />,
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
        path: PATH.newProduct,
        element: <ProductRegister />,
      },
      {
        path: PATH.orders,
        element: <Orders />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function Routes() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
