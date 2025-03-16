import { fetchProducts } from '@/lib/api';
import type { ProductResponse } from '@/lib/types';
import { handleError } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useFetchProductsQuery({
  initialProducts,
}: { initialProducts: ProductResponse }) {
  const { error, ...rest } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam }) => await fetchProducts(pageParam),
    initialPageParam: 1,
    initialData: {
      pages: [initialProducts],
      pageParams: [1],
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.start + 100;
      return nextPage <= 1000 ? nextPage : null;
    },
    select: (data) =>
      data.pages.flatMap((page) =>
        page.items.map((item) => ({
          productId: item.productId,
          image: item.image,
          title: item.title,
          price: item.lprice,
          brand: item.brand,
          category: item.category4,
          maker: item.maker,
        })),
      ),
    staleTime: 1000 * 60 * 2,
    enabled: false,
  });

  return handleError({ data: rest, error });
}
