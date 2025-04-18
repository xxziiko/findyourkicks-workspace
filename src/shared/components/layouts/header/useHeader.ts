import { signOutUser } from '@/features/auth/apis';
import { useUser } from '@/features/user/hooks';

export default function useHeader() {
  const { user, setUser } = useUser();
  const userEmail = user?.email ?? '';

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
  };

  return {
    userEmail,
    handleLogout,
  };
}
