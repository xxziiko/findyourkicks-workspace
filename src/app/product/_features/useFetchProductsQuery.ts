import { fetchProducts } from '@/features/product/apis';
import type { Products } from '@/features/product/types';
import { handleError } from '@/shared/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useFetchProductsQuery({
  initialValues,
}: { initialValues: Products }) {
  const { error, ...rest } = useInfiniteQuery({
    //FIXME: querykey 관리 방식 추후 수정 필요
    queryKey: ['products'],
    queryFn: async ({ pageParam }) => await fetchProducts(pageParam),
    initialPageParam: 1,
    initialData: {
      pages: [initialValues],
      pageParams: [1],
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < 30 ? null : pages.length + 1;
    },
    select: (data) => {
      return data.pages.length === 0 ? [] : data.pages.flat();
    },

    enabled: !!initialValues,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 2,
  });

  return handleError({ data: rest, error });
}
