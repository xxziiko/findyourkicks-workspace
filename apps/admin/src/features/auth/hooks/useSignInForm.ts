import { type User, useSignInMutation, userSchema } from '@/features/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function useSignInForm({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const { mutate: signIn, isPending: isSignInLoading } = useSignInMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: User) => {
    signIn(data, {
      onSuccess,
      onError,
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSignInLoading,
    setError,
  };
}
