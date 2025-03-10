import styles from '@/components/Button.module.scss';

interface ButtonProps {
  key?: number;
  text: string | number;
  variant?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick: () => Promise<void> | void;
}

export default function Button({
  icon,
  text,
  variant,
  disabled,
  onClick,
  ...arg
}: ButtonProps) {
  return (
    <button
      {...arg}
      className={styles[`btn--${variant}`] ?? styles.btn}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <p className={styles.btn__text}>{text}</p>
    </button>
  );
}
