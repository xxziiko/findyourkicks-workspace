import styles from '@/components/Button.module.scss';

interface IButton {
  text: string;
  variant: string;
  icon: React.ReactNode;
  onClick: () => Promise<void>;
}

export default function Button({
  icon,
  text,
  variant,
  onClick,
  ...arg
}: IButton) {
  const buttonClass = `${styles.btn} ${styles[`btn_${variant}`] ?? ''}`;

  return (
    <button {...arg} className={buttonClass} onClick={onClick}>
      {icon}
      <p className={styles.text}>{text}</p>
    </button>
  );
}
