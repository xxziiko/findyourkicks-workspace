import { AUTH_ENDPOINTS } from '@/shared/constants';
import { api } from '@/shared/utils/api';

export const signInWithGoogle = async (next = '/') => {
  return await api.get<string>(
    `${AUTH_ENDPOINTS.signInWithGoogle}?next=${encodeURIComponent(next)}`,
  );
};

export const signInWithKakao = async (next = '/') => {
  return await api.get<string>(
    `${AUTH_ENDPOINTS.signInWithKakao}?next=${encodeURIComponent(next)}`,
  );
};

export const signInWithTestAccount = async () => {
  return await api.post(AUTH_ENDPOINTS.signInWithTestAccount);
};

export const signOutUser = async () => await api.post(AUTH_ENDPOINTS.signOut);
