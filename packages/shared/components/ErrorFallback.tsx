'use client';
import { useQueryClient } from '@tanstack/react-query';
import { CloudAlert } from 'lucide-react';
import { Button } from '../components';
import styles from './ErrorFallback.module.scss';

export function ErrorFallback({ reset }: { reset?: () => void }) {
  const queryClient = useQueryClient();

  const handleReset =
    reset ??
    (() => {
      queryClient.resetQueries();
    });

  return (
    <div className={styles.error}>
      <CloudAlert width={64} height={64} />

      <div className={styles.error__content}>
        <h4>죄송합니다!</h4>
        <p>잠시 후 다시 시도해주세요</p>
      </div>

      <Button type="button" onClick={handleReset}>
        다시 시도
      </Button>
    </div>
  );
}
