import { describe, expect, it, vi } from 'vitest';

const fetchCartListMock = vi.fn();

vi.mock('@/features/cart/apis', () => ({
  fetchCartList: (...args: unknown[]) => fetchCartListMock(...args),
  fetchCartCount: vi.fn(),
}));

import { cartQueries } from '../cartQueries';

describe('cartQueries.list', () => {
  it('forwards request options (e.g. cookie header) to fetchCartList', async () => {
    fetchCartListMock.mockResolvedValue([]);

    const options = cartQueries.list({ headers: { cookie: 'sid=abc' } });
    await options.queryFn({} as Parameters<typeof options.queryFn>[0]);

    expect(fetchCartListMock).toHaveBeenCalledWith({
      headers: { cookie: 'sid=abc' },
    });
  });
});
