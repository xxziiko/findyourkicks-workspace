import { CardSection } from '@/shared/components';
import { Button } from '@findyourkicks/shared';
import styles from './FilterActionButtons.module.scss';

export function FilterActionButtons({ onReset }: { onReset: () => void }) {
  return (
    <CardSection>
      <div className={styles.buttons}>
        <Button type="submit" variant="primary">
          조회
        </Button>
        <Button type="button" variant="secondary" onClick={() => onReset()}>
          초기화
        </Button>
      </div>
    </CardSection>
  );
}
