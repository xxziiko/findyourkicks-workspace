'use client';

import { userAtom } from '@/app/lib/store';
import type { User } from '@supabase/supabase-js';
import { useSetAtom } from 'jotai';

export default function UserInitializer({ user }: { user: User | null }) {
  const setUser = useSetAtom(userAtom);
  setUser(user);

  return null;
}
