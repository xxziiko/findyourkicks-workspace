import { addressQueries } from '@/features/user/address/hooks/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useUserAddressListQuery() {
  return useSuspenseQuery({
    ...addressQueries.list(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 5,
  });
}
