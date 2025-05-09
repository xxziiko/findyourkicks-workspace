import styles from './Description.module.scss';

export default function Description({
  brand,
  price,
  title,
  description,
  category,
}: {
  brand: string;
  price: number;
  title: string;
  description: string;
  category: string;
}) {
  return (
    <div className={styles.description}>
      <div>
        <p className={styles.description__brand}>{brand}</p>
        <p className={styles.description__price}>
          {Number(price).toLocaleString()} 원
        </p>
      </div>

      <div>
        <p>{title}</p>
        <p className={styles.description__subtitle}>
          {`${brand} > ${category}`}
        </p>

        <p className={styles.description__text}>{description}</p>
      </div>
    </div>
  );
}
