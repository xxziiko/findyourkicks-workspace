import { signIn } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';

export function useSignInMutation() {
  return useMutation({
    mutationFn: signIn,
  });
}
