'use client';
import { PATH } from '@/shared/constants/path';
import { ErrorFallback } from '@findyourkicks/shared';
import { useRouter } from 'next/navigation';

export default function MyOrdersError() {
  const router = useRouter();

  return <ErrorFallback reset={() => router.push(PATH.myOrders)} />;
}
