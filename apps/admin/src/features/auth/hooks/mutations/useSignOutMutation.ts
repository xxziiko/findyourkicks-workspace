import { signOut } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';

export function useSignOutMutation({ onSuccess }: { onSuccess: () => void }) {
  return useMutation({
    mutationFn: signOut,
    onSuccess,
  });
}
