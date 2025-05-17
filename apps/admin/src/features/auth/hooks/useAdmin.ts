import type { User } from '@supabase/supabase-js';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

const adminAtom = atom<User | null>(null);

const adminNameAtom = atom<string | null>((get) => {
  const admin = get(adminAtom);
  return admin?.user_metadata.name ?? null;
});

export function useAdmin() {
  const [admin, setAdmin] = useAtom(adminAtom);
  const name = useAtomValue(adminNameAtom);

  const updateAdmin = useCallback(
    (admin: User | null) => {
      setAdmin(admin);
    },
    [setAdmin],
  );

  return { admin, name, updateAdmin };
}
