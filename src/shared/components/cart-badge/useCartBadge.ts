import { cartQueries } from '@/features/cart';
import { userIdAtom } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

export default function useCartBadge() {
  const userId = useAtomValue(userIdAtom);

  // FIXME: 장바구니 개수 api 만들기
  const { data: badgeCount } = useQuery({
    ...cartQueries.list(),
    enabled: !!userId,
    select: (data) => data.length,
  });

  return { badgeCount };
}
