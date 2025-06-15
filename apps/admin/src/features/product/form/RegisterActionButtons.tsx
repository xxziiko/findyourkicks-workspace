import { Button, formatDateWithTime } from '@findyourkicks/shared';
import styles from './RegisterActionButtons.module.scss';

interface RegisterActionButtonsProps {
  onResetClick: () => void;
  onDraftClick: () => void;
  savedTime: string;
}

export function RegisterActionButtons({
  onResetClick,
  onDraftClick,
  savedTime,
}: RegisterActionButtonsProps) {
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
