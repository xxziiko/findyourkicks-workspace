import type { User } from '@supabase/supabase-js';
import { atom, useAtom } from 'jotai';

const userAtom = atom<User | null>(null);
const userIdAtom = atom((get) => get(userAtom)?.id ?? '');
const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

export default function useUser() {
  const [user, setUser] = useAtom(userAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  return {
    user,
    userId,
    isAuthenticated,
    setUser,
    setUserId,
    setIsAuthenticated,
  };
}
