import styles from './StarRating.module.scss';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  if (readonly) {
    return (
      <span
        className={`${styles.stars} ${styles[`stars--${size}`]}`}
        aria-label={`별점 ${value}점`}
      >
        {stars.map((star) => {
          const filled = value >= star;
          const half = !filled && value >= star - 0.5;
          return (
            <span key={star} className={styles.star}>
              {filled ? '★' : half ? '⯨' : '☆'}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <span className={`${styles.stars} ${styles[`stars--${size}`]}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${styles['star--interactive']} ${value >= star ? styles['star--filled'] : ''}`}
          onClick={() => onChange?.(star)}
          aria-label={`${star}점`}
        >
          {value >= star ? '★' : '☆'}
        </button>
      ))}
    </span>
  );
}
