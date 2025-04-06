import { fetchCartItems } from '@/lib/api';
import { userIdAtom } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';

export default function useCartBadge() {
  const router = useRouter();
  const userId = useAtomValue(userIdAtom);

  const { data: cartItems } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => await fetchCartItems(userId ?? ''),
    enabled: !!userId,
    staleTime: 60 * 2,
  });

  const handleCartButton = () => {
    router.push('/cart');
  };

  const badgeCount = cartItems?.length ?? 0;

  return { badgeCount, handleCartButton, userId };
}
