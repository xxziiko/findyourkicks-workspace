import { createOrderSheet } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function useCreateOrderSheetMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: createOrderSheet,
    onSuccess: (response: { orderSheetId: string }) => {
      router.push(`/checkout/${response.orderSheetId}`);
    },
  });
}
