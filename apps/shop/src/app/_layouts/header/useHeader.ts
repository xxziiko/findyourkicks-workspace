import { signOutUser } from '@/features/auth/apis';
import { useUser } from '@/features/user/hooks';

export function useHeader() {
  const { user, updateUser } = useUser();
  const userEmail = user?.email ?? '';

  const handleLogout = async () => {
    await signOutUser();
    updateUser(null);
  };

  return {
    userEmail,
    handleLogout,
  };
}
