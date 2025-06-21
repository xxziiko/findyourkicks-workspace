import { supabase } from '@/shared';
import { useEffect, useState } from 'react';
import { useAdmin } from './useAdmin';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const { updateAdmin } = useAdmin();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateAdmin(session?.user ?? null);
        setIsLoading(false);
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [updateAdmin]);

  return { isLoading };
}
