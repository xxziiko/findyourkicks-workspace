import { useTossPayments } from '@/features/order';
import { requestPayments } from '@/features/payment/apis';
import { useMutation } from '@tanstack/react-query';

interface TosspaymentsPayload {
  orderName: string;
  amount: number;
}

export default function useOrderItemsMutation({
  restTossPaymentsPayload,
}: { restTossPaymentsPayload: TosspaymentsPayload }) {
  const { requestTossPayments } = useTossPayments();

  return useMutation({
    mutationFn: requestPayments,
    onSuccess: (response) => {
      requestTossPayments({
        ...response,
        ...restTossPaymentsPayload,
      });
    },
  });
}
