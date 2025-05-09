import { createQueries } from '@findyourkicks/shared';
import { fetchOrderHistory } from '../../apis';

export const orderQueries = createQueries('order', {
  history: (page: number) => ({
    queryFn: () => fetchOrderHistory(page),
  }),
});
