'use client';

import { useUser } from '@/features/user/hooks';
import { PATH } from '@/shared/constants/path';
import { isAuthPath } from '@/shared/utils';
import { createClient } from '@/shared/utils/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const supabase = createClient();

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { updateUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.access_token && isAuthPath(pathname)) {
          router.push(PATH.login);
        }

        if (session?.access_token && pathname === PATH.login) {
          router.push('/');
        }

        if (event === 'SIGNED_OUT') {
          updateUser(null);
        }

        updateUser(session?.user ?? null);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname, router, updateUser]);

  return children;
}
