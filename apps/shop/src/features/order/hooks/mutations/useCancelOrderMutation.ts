import { ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderQueries } from '../queries/orderQueries';

interface CancelOrderBody {
  reason: string;
}

const cancelOrder = (orderId: string, body: CancelOrderBody) => {
  return api.post<void, CancelOrderBody>(
    `${ENDPOINTS.orders}/${orderId}/cancel`,
    body,
  );
};

export function useCancelOrderMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CancelOrderBody) => cancelOrder(orderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueries.all() });
    },
  });
}
