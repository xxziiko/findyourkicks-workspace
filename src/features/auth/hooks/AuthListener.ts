'use client';

import { useUser } from '@/features/user/hooks';
import { PATH } from '@/shared/constants/path';
import { isAuthPath } from '@/shared/utils';
import { createClient } from '@/shared/utils/supabase/client';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthListener() {
  const { setUser } = useUser();
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.access_token && isAuthPath(pathname)) {
          redirect(PATH.login);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          return;
        }

        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, supabase, pathname]);

  return null;
}
