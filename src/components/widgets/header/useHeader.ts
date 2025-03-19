import { signOutUser } from '@/lib/api';
import { cartItemsAtom, userAtom } from '@/lib/store';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export default function useHeader() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [user, setUser] = useAtom(userAtom);
  const userEmail = user?.email ?? '';
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    setItems([]);
    router.push('/');
  };

  const handleCartButton = () => {
    router.push('/cart');
  };

  return {
    items,
    userEmail,
    handleLogout,
    handleCartButton,
  };
}
