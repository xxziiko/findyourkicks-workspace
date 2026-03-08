import { signIn } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';

export function useSignInMutation() {
  return useMutation({
    mutationFn: signIn,
    onError: (error) => {
      console.error(
        '[useSignInMutation] failed:',
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    },
  });
}
