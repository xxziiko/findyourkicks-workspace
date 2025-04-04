import { signOutUser } from '@/lib/api';
import { fetchCartItems } from '@/lib/api';
import { userAtom } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export default function useHeader() {
  const [user, setUser] = useAtom(userAtom);
  const userEmail = user?.email ?? '';
  const router = useRouter();
  const { data: cartItems } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => await fetchCartItems(user?.id ?? ''),
  });

  const badgeCount = cartItems?.length ?? 0;

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    router.push('/');
  };

  const handleCartButton = () => {
    router.push('/cart');
  };

  return {
    badgeCount,
    userEmail,
    handleLogout,
    handleCartButton,
  };
}
