import { requestPayments } from '@/features/payment/apis';
import { useMutation } from '@tanstack/react-query';

export function useOrderItemsMutation() {
  return useMutation({
    mutationFn: requestPayments,
  });
}
