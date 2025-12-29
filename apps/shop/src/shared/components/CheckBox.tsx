import { memo } from 'react';
import styles from './CheckBox.module.scss';

type CheckBoxProps = {
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  'aria-label'?: string;
};

const CheckBox = (props: CheckBoxProps) => {
  return <input type="checkbox" className={styles.checkbox} {...props} />;
};

export default memo(CheckBox);
