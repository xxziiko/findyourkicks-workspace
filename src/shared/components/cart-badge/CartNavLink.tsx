'use client';

import { CartBadge } from '@/shared/components';
import Link from 'next/link';
import styles from './CartNavLink.module.scss';
import useCartBadge from './useCartBadge';

export default function CartNavLink() {
  const { badgeCount } = useCartBadge();

  return (
    <Link href="/cart" className={styles.tab}>
      CART
      {!!badgeCount && <CartBadge quantity={badgeCount} />}
    </Link>
  );
}
