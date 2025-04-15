import { signOutUser } from '@/features/auth/apis';
import { userAtom } from '@/lib/store';
import { useAtom } from 'jotai';

export default function useHeader() {
  const [user, setUser] = useAtom(userAtom);
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
