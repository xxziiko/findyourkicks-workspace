import { fetchCartList } from '@/features/cart/apis';
import { userIdAtom } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

export default function useCartBadge() {
  const userId = useAtomValue(userIdAtom);

  // FIXME: 장바구니 개수 api 만들기
  const { data: badgeCount } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCartList,
    enabled: !!userId,
    staleTime: 60,
    select: (data) => data.length ?? 0,
  });

  return { badgeCount, userId };
}
