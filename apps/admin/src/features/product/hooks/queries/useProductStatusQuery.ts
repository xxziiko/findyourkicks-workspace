import { useSuspenseQuery } from '@tanstack/react-query';
import { productQueries } from './productQueries';

export const useProductStatusQuery = () => {
  return useSuspenseQuery({
    ...productQueries.status(),
    staleTime: 60 * 60 * 1000,
  });
};
