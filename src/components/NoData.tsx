import styles from './NoData.module.scss';

export default function NoData({
  icon,
  title,
}: { icon: React.ReactNode; title: string }) {
  return (
    <section className={styles.section}>
      {icon}
      <p>{title}</p>
    </section>
  );
}
