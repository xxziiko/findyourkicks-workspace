'use client';

import { PATH } from '@/shared/constants';
import { ErrorFallback } from '@findyourkicks/shared';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  return <ErrorFallback reset={() => router.push(PATH.home)} />;
}
