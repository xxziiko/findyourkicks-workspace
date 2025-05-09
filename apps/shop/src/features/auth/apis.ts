import { api } from '@/shared/utils/api';

export const signInWithGoogle = async (next = '/') => {
  return await api.get<string>(`/auth/google?next=${encodeURIComponent(next)}`);
};

export const signInWithKakao = async (next = '/') => {
  return await api.get<string>(`/auth/kakao?next=${encodeURIComponent(next)}`);
};

export const signOutUser = async () => await api.post('/auth/signout');
