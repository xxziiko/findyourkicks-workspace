import type { User } from '@supabase/supabase-js';
import { atom, useAtom, useAtomValue } from 'jotai';

const userAtom = atom<User | null>(null);
const userIdAtom = atom((get) => get(userAtom)?.id ?? '');
const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

export function useUser() {
  const [user, setUser] = useAtom<User | null>(userAtom);
  const userId = useAtomValue(userIdAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const updateUser = (user: User | null) => {
    setUser(user);
  };

  return {
    user,
    userId,
    isAuthenticated,
    updateUser,
  };
}
