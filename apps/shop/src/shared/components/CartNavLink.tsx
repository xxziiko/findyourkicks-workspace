'use client';

import { CartBadge } from '@/shared/components';
import { useCartBadge } from '@/shared/hooks';
import Link from 'next/link';
import styles from './CartNavLink.module.scss';

export default function CartNavLink() {
  const { badgeCount } = useCartBadge();

  return (
    <Link href="/cart" className={styles.tab}>
      CART
      {!!badgeCount && <CartBadge quantity={badgeCount} />}
    </Link>
  );
}
