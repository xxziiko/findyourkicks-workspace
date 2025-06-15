import dayjs from 'dayjs';

export function formatDateDefault(date: string) {
  return dayjs(date).format('YYYY.MM.DD');
}

export function formatDateWithTime(date: string) {
  return dayjs(date).format('YYYY.MM.DD HH:mm:ss');
}
