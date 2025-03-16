import styles from '@/components/Button.module.scss';

interface ButtonProps {
  key?: number | string;
  text: string | number;
  variant?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick: () => Promise<void> | void;
}

export default function Button({ icon, text, variant, ...props }: ButtonProps) {
  return (
    <button {...props} className={styles[`btn--${variant}`] ?? styles.btn}>
      {icon}
      <p className={styles.btn__text}>{text}</p>
    </button>
  );
}
