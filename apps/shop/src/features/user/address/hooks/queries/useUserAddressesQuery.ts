import { addressQueries } from '@/features/user/address/hooks/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useUserAddressesQuery() {
  return useSuspenseQuery({
    ...addressQueries.list(),
    refetchOnWindowFocus: false,
  });
}
