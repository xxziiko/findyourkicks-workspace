import { Button, formatDateWithTime } from '@findyourkicks/shared';
import styles from './FormActions.module.scss';

interface FormActionsProps {
  onResetClick: () => void;
  onDraftClick: () => void;
  savedTime: string;
}

export function FormActions({
  onResetClick,
  onDraftClick,
  savedTime,
}: FormActionsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.saved}>
        {savedTime && (
          <p>
            임시저장 되었습니다. <br /> {formatDateWithTime(savedTime)}
          </p>
        )}
      </div>

      <div className={styles.buttons}>
        <Button type="button" variant="secondary" onClick={onDraftClick}>
          임시저장
        </Button>
        <Button type="submit" variant="primary">
          등록하기
        </Button>
        <Button type="button" variant="secondary" onClick={onResetClick}>
          취소
        </Button>
      </div>
    </div>
  );
}
