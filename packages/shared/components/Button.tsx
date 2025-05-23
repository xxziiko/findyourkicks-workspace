'use client';

import { Loader } from 'lucide-react';
import styles from './Button.module.scss';

type Variant =
  | 'kakao'
  | 'google'
  | 'lined'
  | 'lined--small'
  | 'lined--r'
  | 'label'
  | 'primary'
  | 'secondary';
interface ButtonProps {
  key?: number | string;
  text?: string | number;
  variant?: Variant;
  icon?: React.ReactNode;
  width?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent) => Promise<void> | void;
  children?: React.ReactNode;
}

export function Button({
  icon,
  text,
  variant,
  width,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={styles[`btn-${variant}`] ?? styles.btn}
      style={{ width }}
    >
      {icon}

      {isLoading ? (
        <Loader className={styles.btn__loader} />
      ) : (
        <p>{children ?? text}</p>
      )}
    </button>
  );
}
