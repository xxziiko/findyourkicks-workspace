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
  onClick: () => Promise<void> | void;
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
      className={styles[`btn_${variant}`] ?? styles.btn}
      style={{ width }}
    >
      {icon}
      <p className={styles.btn__text}>{text}</p>
    </button>
  );
}
