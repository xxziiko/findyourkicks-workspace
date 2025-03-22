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
  disabled?: boolean;
  onClick: () => Promise<void> | void;
}

export default function Button({ icon, text, variant, ...props }: ButtonProps) {
  return (
    <button {...props} className={styles[`btn_${variant}`] ?? styles.btn}>
      {icon}
      <p className={styles.btn__text}>{text}</p>
    </button>
  );
}
