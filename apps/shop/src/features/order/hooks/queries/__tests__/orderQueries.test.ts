import { describe, expect, it, vi } from 'vitest';

const fetchOrderHistoryMock = vi.fn();

vi.mock('@/features/order', () => ({
  fetchOrderHistory: (...args: unknown[]) => fetchOrderHistoryMock(...args),
}));

import { orderQueries } from '../orderQueries';

describe('orderQueries.history', () => {
  it('forwards request options (e.g. cookie header) to fetchOrderHistory', async () => {
    fetchOrderHistoryMock.mockResolvedValue({
      orders: [],
      lastPage: 1,
      currentPage: 2,
      hasNext: false,
    });

    const options = orderQueries.history(2, {
      headers: { cookie: 'sid=abc' },
    });
    await options.queryFn({} as Parameters<typeof options.queryFn>[0]);

    expect(fetchOrderHistoryMock).toHaveBeenCalledWith(2, {
      headers: { cookie: 'sid=abc' },
    });
  });
});
