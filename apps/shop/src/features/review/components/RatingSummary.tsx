import type { RatingSummary as RatingSummaryType } from '../types';
import styles from './RatingSummary.module.scss';
import StarRating from './StarRating';

interface RatingSummaryProps {
  summary: RatingSummaryType;
}

export default function RatingSummary({ summary }: RatingSummaryProps) {
  const { average, count, distribution } = summary;
  const grades = [5, 4, 3, 2, 1] as const;

  return (
    <div className={styles.container}>
      <div className={styles.average}>
        <span className={styles.average__score}>{average.toFixed(1)}</span>
        <StarRating value={average} readonly size="lg" />
        <span className={styles.average__count}>리뷰 {count}개</span>
      </div>

      <div className={styles.distribution}>
        {grades.map((grade) => {
          const gradeCount = distribution[grade] ?? 0;
          const percent =
            count > 0 ? Math.round((gradeCount / count) * 100) : 0;
          return (
            <div key={grade} className={styles.distribution__row}>
              <span className={styles.distribution__grade}>{grade}점</span>
              <div className={styles.distribution__bar}>
                <div
                  className={styles.distribution__fill}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className={styles.distribution__count}>{gradeCount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
