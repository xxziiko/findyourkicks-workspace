import styles from '@/components/Button.module.scss';

interface IButton {
  text: string;
  variant: string;
  icon: React.ReactNode;
  onClick: () => Promise<void> | void;
}

export default function Button({
  icon,
  text,
  variant,
  onClick,
  ...arg
}: IButton) {
  return (
    <button
      {...arg}
      className={styles[`btn_${variant}`] ?? styles.btn}
      onClick={onClick}
    >
      {icon}
      <p className={styles.text}>{text}</p>
    </button>
  );
}
