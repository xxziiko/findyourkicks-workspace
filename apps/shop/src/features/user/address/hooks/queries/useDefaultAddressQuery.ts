import { addressQueries } from '@/features/user/address/hooks/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useDefaultAddressQuery() {
  return useSuspenseQuery({
    ...addressQueries.default(),
    refetchOnWindowFocus: false,
  });
}
