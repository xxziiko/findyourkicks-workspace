import { useCartCountQuery } from '@/features/cart/hooks';
import { useUser } from '@/features/user/hooks';

export function useCartBadge() {
  const { userId } = useUser();
  const { data: cartCount } = useCartCountQuery(userId);

  return { badgeCount: cartCount?.count ?? 0 };
}
