'use client';

import { Loader } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import styles from './Button.module.scss';

type Variant = 'kakao' | 'google' | 'label' | 'primary' | 'secondary';
interface ButtonProps extends PropsWithChildren {
  key?: number | string;
  variant?: Variant;
  icon?: React.ReactNode;
  width?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent) => Promise<void> | void;
  radius?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  icon,
  variant = 'primary',
  width,
  isLoading,
  children,
  radius,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${styles[`btn-${variant}`]} ${radius && styles[`btn-${variant}--radius`]} ${size && styles[`btn-${variant}--${size}`]}`}
      style={{ width }}
    >
      {icon}

      {isLoading ? (
        <Loader className={styles.btn__loader} />
      ) : (
        <p>{children}</p>
      )}
    </button>
  );
}
