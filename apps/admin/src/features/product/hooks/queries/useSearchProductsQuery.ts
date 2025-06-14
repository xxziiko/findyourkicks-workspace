import { useQuery } from '@tanstack/react-query';
import { productQueries } from './productQueries';

export const useSearchProductsQuery = () => {
  return useQuery({
    ...productQueries.list(),
    enabled: false,
    staleTime: 2 * 60 * 1000,
  });
};
