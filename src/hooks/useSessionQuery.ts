import { handleError } from '@/app/lib/utils';
import { createClient } from '@/app/lib/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

const getSession = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export default function useSessionQuery({
  initialSession,
}: { initialSession: User | null }) {
  const { error, ...rest } = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    initialData: initialSession,
    staleTime: 1000 * 60 * 2,
  });

  return handleError({ data: rest, error });
}
