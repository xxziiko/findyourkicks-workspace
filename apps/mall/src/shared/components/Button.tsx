import styles from '@/shared/components/Button.module.scss';
import { Loader } from 'lucide-react';

type Variant =
  | 'kakao'
  | 'google'
  | 'lined'
  | 'lined--small'
  | 'lined--r'
  | 'label';
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

export default function Button({
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

      {isLoading ? <Loader className={styles.btn__loader} /> : <p>{children ?? text}</p>}
    </button>
  );
}
