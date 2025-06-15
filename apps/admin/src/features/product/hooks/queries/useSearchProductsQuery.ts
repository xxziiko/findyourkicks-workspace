import { useQuery } from '@tanstack/react-query';
import type { ProductSearchForm } from '../../types';
import { productQueries } from './productQueries';

export const useSearchProductsQuery = (params: Partial<ProductSearchForm>) => {
  return useQuery({
    ...productQueries.list(params),
    enabled: !!params.page,
    staleTime: 5 * 60 * 1000,
  });
};
