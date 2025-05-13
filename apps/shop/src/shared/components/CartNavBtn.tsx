'use client';

import { CartBadge } from '@/shared/components';
import { useCartBadge } from '@/shared/hooks';
import Link from 'next/link';
import styles from './CartNavBtn.module.scss';

export default function CartNavBtn() {
  const { badgeCount } = useCartBadge();

  return (
    <Link href="/cart" className={styles.tab}>
      CART
      {!!badgeCount && <CartBadge quantity={badgeCount} />}
    </Link>
  );
}
