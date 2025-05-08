'use client';

import { Button } from '@/shared/components';
import { CloudAlert } from 'lucide-react';
import styles from './error.module.scss';

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className={styles.error}>
      <CloudAlert width={64} height={64} />
      
      <div className={styles.error__content}>
        <h4>죄송합니다!</h4>
        <p>잠시 후 다시 시도해주세요</p>
      </div>

      <Button type="button" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}
