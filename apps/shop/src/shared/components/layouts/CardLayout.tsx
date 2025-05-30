import { Button } from '@findyourkicks/shared';
import styles from './CardLayout.module.scss';

export default function CardLayout({
  children,
  title,
  label = false,
  type,
}: {
  children: React.ReactNode;
  title?: string;
  label?: React.ReactNode;
  type?: string;
}) {
  return (
    <div className={styles[`card__${type}`] ?? styles.card}>
      <div className={styles.card__title}>
        {title && <h4>{title}</h4>}
        {label}
      </div>
      {children}
    </div>
  );
}

function Label({ text, ...props }: { text: string; onClick: () => void }) {
  return (
    <Button {...props} variant="label">
      {text}
    </Button>
  );
}

CardLayout.Label = Label;
