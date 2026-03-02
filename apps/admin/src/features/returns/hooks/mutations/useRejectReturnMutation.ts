import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectReturn } from '../../api';
import { returnQueries } from '../queries/returnQueries';

export function useRejectReturnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (returnId: string) => rejectReturn(returnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: returnQueries.all() });
    },
  });
}
