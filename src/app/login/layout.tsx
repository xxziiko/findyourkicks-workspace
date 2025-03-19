import styles from './layout.module.scss';

export default function LoginLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.card__layout}>
        <h3 className={styles.card__title}>
          🚀 3초 만에, <br /> 간편하게 시작해요!
        </h3>
        <div className={styles.card__buttons}>{children}</div>
      </div>
    </div>
  );
}
