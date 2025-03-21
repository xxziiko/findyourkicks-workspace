import Button from '../Button';
import styles from './CardLayout.module.scss';

export default function CardLayout({
  children,
  title,
  label = false,
  type,
}: {
  children: React.ReactNode;
  title?: string;
  label?: boolean;
  type?: string;
}) {
  return (
    <div className={styles[`card_${type}`] ?? styles.card}>
      <div className={styles.card__title}>
        {title && <h4>{title}</h4>}
        {label && <Label text="주소 변경" />}
      </div>
      {children}
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <Button text={text} onClick={() => {}} variant="label" />;
}
