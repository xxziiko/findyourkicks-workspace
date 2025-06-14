import { DatePicker as AntdDatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import styles from './DatePicker.module.scss';

type DatePickerProps = [Dayjs, Dayjs];
const { RangePicker } = AntdDatePicker;

export function DatePicker({
  onChange,
  value,
}: {
  value: DatePickerProps;
  onChange: (dates: DatePickerProps) => void;
}) {
  return (
    <RangePicker
      id={{ start: 'startDate', end: 'endDate' }}
      className={styles.datePicker}
      placeholder={['시작일', '종료일']}
      value={value}
      onChange={(dates) => {
        const [startDate, endDate] = dates as DatePickerProps;
        onChange([startDate, endDate]);
      }}
      format={'YYYY.MM.DD'}
    />
  );
}
