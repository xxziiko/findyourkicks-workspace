'use client';

import { useUser } from '@/features/user/hooks';
import { PATH } from '@/shared/constants/path';
import { isAuthPath } from '@/shared/utils';
import { createClient } from '@/shared/utils/supabase/client';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const pathname = usePathname();
  const { setUser } = useUser();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.access_token && isAuthPath(pathname)) {
          redirect(PATH.login);
        }

        if (session?.access_token && pathname === PATH.login) {
          redirect('/');
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
        }

        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, pathname, setUser]);

  return children;
}
