import { Button } from '@findyourkicks/shared';
import type { MouseEvent } from 'react';
import styles from './FormActions.module.scss';

interface FormActionsProps {
  onReset: () => void;
}

export function FormActions({ onReset }: FormActionsProps) {
  return (
    <div className={styles.buttons}>
      <Button type="button" variant="secondary">
        임시저장
      </Button>
      <Button type="submit" variant="primary">
        등록하기
      </Button>
      <Button type="button" variant="secondary" onClick={onReset}>
        취소
      </Button>
    </div>
  );
}
