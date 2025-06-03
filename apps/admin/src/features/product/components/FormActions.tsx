import { Button } from '@findyourkicks/shared';
import styles from './FormActions.module.scss';

interface FormActionsProps {
  onResetClick: () => void;
}

export function FormActions({ onResetClick }: FormActionsProps) {
  return (
    <div className={styles.buttons}>
      <Button type="button" variant="secondary">
        임시저장
      </Button>
      <Button type="submit" variant="primary">
        등록하기
      </Button>
      <Button type="button" variant="secondary" onClick={onResetClick}>
        취소
      </Button>
    </div>
  );
}
