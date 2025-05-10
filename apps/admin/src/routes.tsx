import { PATH } from '@/shared';
import { ErrorFallback } from '@findyourkicks/shared';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashborad from './pages/Dashborad';

const router = createBrowserRouter([
  {
    path: PATH.dashboard,
    element: <Dashborad />,
    errorElement: <ErrorFallback />,
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
