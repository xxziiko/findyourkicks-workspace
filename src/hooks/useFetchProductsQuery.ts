import { fetchProducts } from '@/app/lib/api';
import { handleError } from '@/app/lib/utils';
import type { ProductResponse } from '@/types/product';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export default function useFetchProductsQuery({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const { error, ...rest } = useSuspenseInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 1 }) =>
      await fetchProducts((pageParam - 1) * 100 + 1),
    initialPageParam: 1,
    initialData: {
      pages: [initialProducts],
      pageParams: [1],
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      const nextStart = (nextPage - 1) * 100 + 1;

      return nextStart <= 1000 ? nextPage : null;
    },
    select: (data) => data.pages.flatMap((page) => page.items),
    staleTime: 1000 * 60 * 2,
  });

  return handleError({ data: rest, error });
}
