import { PATH } from '@/shared';
import { PageLayout } from '@/shared/components';
import { ErrorFallback } from '@findyourkicks/shared';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Dashborad, Products } from './pages';

const router = createBrowserRouter([
  {
    path: PATH.default,
    element: <PageLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <Dashborad />,
      },
      {
        path: PATH.products,
        element: <Products />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
