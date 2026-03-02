import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveReturn } from '../../api';
import { returnQueries } from '../queries/returnQueries';

export function useApproveReturnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (returnId: string) => approveReturn(returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: returnQueries.all() });
    },
  });
}
