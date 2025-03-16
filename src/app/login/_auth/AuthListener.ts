'use client';

import { userAtom } from '@/lib/store';
import { createClient } from '@/lib/utils/supabase/client';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export default function AuthListener() {
  const setUser = useSetAtom(userAtom);
  const supabase = createClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, supabase]);

  return null;
}
