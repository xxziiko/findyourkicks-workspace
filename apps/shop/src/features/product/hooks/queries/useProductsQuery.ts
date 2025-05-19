import { fetchProducts } from '@/features/product/apis';
import { productKeys } from '@/features/product/hooks/queries';
import type { Products } from '@/features/product/types';
import { handleError } from '@findyourkicks/shared';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useProductsQuery({
  initialValues,
}: { initialValues: Products }) {
  const { error, ...rest } = useInfiniteQuery({
    queryKey: productKeys.list(),
    queryFn: ({ pageParam }) => fetchProducts(pageParam),
    initialData: {
      pages: [initialValues],
      pageParams: [1],
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < 30 ? null : pages.length + 1;
    },
    select: (data) => {
      return data.pages.length === 0 ? [] : data.pages.flat();
    },
    enabled: false,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return handleError({ data: rest, error });
}
