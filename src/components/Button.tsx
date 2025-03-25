import styles from '@/components/Button.module.scss';

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
  onClick: (e: React.MouseEvent) => Promise<void> | void;
}

export default function Button({
  icon,
  text,
  variant,
  width,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={styles[`btn-${variant}`] ?? styles.btn}
      style={{ width }}
    >
      {icon}
      <p>{text}</p>
    </button>
  );
}
