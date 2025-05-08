'use client';
import { createOrderSheet } from '@/features/order-sheet/apis';
import { PATH } from '@/shared/constants/path';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function useCreateOrderSheetMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: createOrderSheet,
    onSuccess: (response: { orderSheetId: string }) => {
      router.push(`${PATH.checkout}/${response.orderSheetId}`);
    },
  });
}
