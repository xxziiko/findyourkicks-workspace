import { fetchOrderHistory } from '../../apis';
import { createQueries } from '@/shared/utils/createQueries';

export const orderQueries = createQueries('order', {
  history: (page: number) => ({
    queryFn: () => fetchOrderHistory(page),
  }),
});
