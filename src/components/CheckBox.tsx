import { memo } from 'react';
import styles from './CheckBox.module.scss';

type CheckBoxProps = {};

const CheckBox = (props: CheckBoxProps) => {
  return <input type="checkbox" className={styles.checkbox} />;
};

export default memo(CheckBox);
