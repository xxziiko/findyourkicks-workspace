import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDateDefault(date: string) {
  return format(date, 'yyyy.MM.dd', { locale: ko });
}

export function formatDateWithTime(date: string) {
  return format(date, 'yyyy.MM.dd HH:mm:ss', { locale: ko });
}
