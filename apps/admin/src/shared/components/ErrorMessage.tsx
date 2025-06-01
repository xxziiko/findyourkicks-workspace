import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  id: string;
  error: string | undefined;
}

export function ErrorMessage({ id, error }: ErrorMessageProps) {
  return (
    <p className={styles.error} data-testid={`${id}-error`}>
      {error}
    </p>
  );
}
