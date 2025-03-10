'use client';
import styles from './Badge.module.scss';

export default function Badge({ quantity }: { quantity: number }) {
  return (
    <span className={styles.badge}>
      <p>{quantity}</p>
    </span>
  );
}
