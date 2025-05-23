import styles from './InputWithUnit.module.scss';

interface InputWithUnitProps {
  id: string;
  placeholder: string;
  unit?: string;
}
export function InputWithUnit({ id, placeholder, unit }: InputWithUnitProps) {
  return (
    <div className={styles.container}>
      <input
        name={id}
        className={styles.input}
        placeholder={placeholder}
        type="text"
      />
      {unit}
    </div>
  );
}
