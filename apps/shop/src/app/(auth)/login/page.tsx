import { LoginCardButtons } from '@/features/auth/components/LoginCardButtons';
import { Suspense } from 'react';
import Loading from './loading';

export default function Login() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginCardButtons />
    </Suspense>
  );
}
