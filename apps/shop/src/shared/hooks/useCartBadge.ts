import { cartQueries } from '@/features/cart';
import { useUser } from '@/features/user/hooks';
import { useQuery } from '@tanstack/react-query';

export function useCartBadge() {
  const { userId } = useUser();
  const { data: cartCount } = useQuery(cartQueries.count(userId));

  return { badgeCount: cartCount?.count ?? 0 };
}
