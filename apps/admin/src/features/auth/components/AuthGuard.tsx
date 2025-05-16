import { useAdmin, useAuth } from '@/features/auth';
import { PATH } from '@/shared';
import { Loading } from '@/shared/components';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }: PropsWithChildren) => {
  const { admin } = useAdmin();
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!admin) {
    return <Navigate to={PATH.login} />;
  }

  return <>{children}</>;
};
