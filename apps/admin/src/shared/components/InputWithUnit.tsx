import styles from './InputWithUnit.module.scss';

interface InputWithUnitProps {
  id: string;
  placeholder: string;
  unit?: string;
  type?: 'text' | 'number';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}
export function InputWithUnit({ id, unit, ...props }: InputWithUnitProps) {
  return (
    <div className={styles.container}>
      <input
        name={id}
        className={styles.input}
        {...props}
        data-testid={id}
        autoComplete="off"
      />
      {unit}
    </div>
  );
}
