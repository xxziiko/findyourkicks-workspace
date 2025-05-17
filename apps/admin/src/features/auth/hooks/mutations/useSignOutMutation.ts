import { signOut } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';

export function useSignOutMutation() {
  return useMutation({
    mutationFn: signOut,
  });
}
