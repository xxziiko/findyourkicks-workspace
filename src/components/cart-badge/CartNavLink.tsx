'use client';

import { CartBadge } from '@/components';
import styles from '@/components/layouts/header/Header.module.scss';
import Link from 'next/link';
import useCartBadge from './useCartBadge';

export default function CartNavLink() {
  const { badgeCount } = useCartBadge();

  return (
    <Link href="/cart" className={styles.tabs__tab}>
      CART
      {!!badgeCount && <CartBadge quantity={badgeCount} />}
    </Link>
  );
}
