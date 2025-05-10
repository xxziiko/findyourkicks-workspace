import type { User } from '@supabase/supabase-js';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

const userAtom = atom<User | null>(null);
const userIdAtom = atom((get) => get(userAtom)?.id ?? '');
const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

export function useUser() {
  const [user, setUser] = useAtom<User | null>(userAtom);
  const userId = useAtomValue(userIdAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const updateUser = useCallback(
    (user: User | null) => {
      setUser(user);
    },
    [setUser],
  );

  return {
    user,
    userId,
    isAuthenticated,
    updateUser,
  };
}
