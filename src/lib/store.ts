import type { User } from '@supabase/supabase-js';
import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);
export const userIdAtom = atom((get) => get(userAtom)?.id ?? '');
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const isAllCheckedAgreementAtom = atom(false);
