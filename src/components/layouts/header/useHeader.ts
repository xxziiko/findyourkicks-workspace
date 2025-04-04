import { signOutUser } from '@/lib/api';
import { userAtom } from '@/lib/store';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export default function useHeader() {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const userEmail = user?.email ?? '';

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    router.push('/');
  };

  return {
    userEmail,
    handleLogout,
  };
}
