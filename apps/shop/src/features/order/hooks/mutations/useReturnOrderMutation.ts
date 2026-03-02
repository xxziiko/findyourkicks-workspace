import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderQueries } from '../queries/orderQueries';

interface ReturnOrderBody {
  returnType: 'return' | 'exchange';
  reason: string;
  details?: string;
}

const returnOrder = (orderId: string, body: ReturnOrderBody) => {
  return api.post<void, ReturnOrderBody>(
    `${ENDPOINTS.orders}/${orderId}/return`,
    body,
  );
};

export function useReturnOrderMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ReturnOrderBody) => returnOrder(orderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueries.all() });
    },
  });
}
