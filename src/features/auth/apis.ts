import { api } from '@/shared/utils/api';

export const signInWithGoogle = async (next = '/') => {
  const { data } = await api.post<{ url: string }>(
    `/auth/google?next=${encodeURIComponent(next)}`,
  );

  return data.url;
};

export const signInWithKakao = async (next = '/') => {
  const { data } = await api.post<{ url: string }>(
    `/auth/kakao?next=${encodeURIComponent(next)}`,
  );

  return data.url;
};

export const signOutUser = async () => await api.post('/auth/signout');
