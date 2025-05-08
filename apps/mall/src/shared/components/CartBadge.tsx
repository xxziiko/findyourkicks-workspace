'use client';
import styles from './CartBadge.module.scss';

export default function CartBadge({ quantity }: { quantity: number }) {
  return (
    <span className={styles.badge}>
      <p>{quantity}</p>
    </span>
  );
}
