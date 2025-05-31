import { useMutation } from '@tanstack/react-query';
import { signInWithTestAccount } from '../apis';

export function useTestAccountMutation({
  onSuccess,
}: { onSuccess: () => void }) {
  return useMutation({
    mutationFn: signInWithTestAccount,
    onSuccess,
  });
}
