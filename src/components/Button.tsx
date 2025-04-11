import styles from '@/components/Button.module.scss';
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
  text: string | number;
  variant?: Variant;
  icon?: React.ReactNode;
  width?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent) => Promise<void> | void;
}

export default function Button({
  icon,
  text,
  variant,
  width,
  isLoading,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={styles[`btn-${variant}`] ?? styles.btn}
      style={{ width }}
    >
      {icon}

      {isLoading ? <Loader className={styles.btn__loader} /> : <p>{text}</p>}
    </button>
  );
}
