import type { ApiResponse } from '@/lib/types';
import { assert } from '@/lib/utils';

// products
export const fetchNaverData = async (start = 1) => {
  const API_URL = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
    '운동화',
  )}&display=99&start=${start}&sort=sim`;

  const response = await fetch(API_URL, {
    method: 'GET',
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'curl/7.49.1',
      'X-Naver-Client-Id': process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
    },
  });

  assert(response.ok, 'Failed to fetch data');

  return response.json();
};

export const fetchProducts = async (page = 1): Promise<ApiResponse> => {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`,
  ).then((res) => res.json());

  return data;
};

export const fetchProductById = async (productId: string) =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
  ).then((res) => res.json());

// login
export const signInWithGoogle = async (next = '/') =>
  await fetch(`/api/auth/google?next=${encodeURIComponent(next)}`).then((res) =>
    res.json(),
  );

export const signInWithKakao = async (next = '/') =>
  await fetch(`/api/auth/kakao?next=${encodeURIComponent(next)}`).then((res) =>
    res.json(),
  );

export const signOutUser = async () =>
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
    method: 'POST',
  });
