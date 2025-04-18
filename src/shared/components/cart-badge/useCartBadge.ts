import { cartQueries } from '@/features/cart';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useCartBadge() {
  // FIXME: 장바구니 개수 api 만들기
  const { data: badgeCount } = useSuspenseQuery({
    ...cartQueries.list(),
    select: (data) => data.length,
  });

  return { badgeCount };
}
