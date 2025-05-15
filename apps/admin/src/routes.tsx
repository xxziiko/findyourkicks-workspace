import { PATH } from '@/shared';
import { PageLayout } from '@/shared/components';
import { ErrorFallback } from '@findyourkicks/shared';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Dashboard, Products } from './pages';

const router = createBrowserRouter([
  {
    path: PATH.default,
    element: <PageLayout />,
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
