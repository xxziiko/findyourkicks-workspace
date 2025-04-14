import { fetchCartList } from '@/features/cart/apis';
import { userIdAtom } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';

export default function useCartBadge() {
  const router = useRouter();
  const userId = useAtomValue(userIdAtom);

  // FIXME: 장바구니 개수 api 만들기
  const { data: cartItems } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => await fetchCartList(userId ?? ''),
    enabled: !!userId,
    staleTime: 60 * 2,
  });

  const handleCartButton = () => {
    router.push('/cart');
  };

  const badgeCount = cartItems?.length ?? 0;

  return { badgeCount, handleCartButton, userId };
}
