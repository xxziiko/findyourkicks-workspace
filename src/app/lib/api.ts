import { assert } from '@/app/lib/utils';
import type { ApiResponse } from '@/types/product';

export const fetchNaverData = async (start = 1) => {
  const API_URL = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
    '운동화',
  )}&display=100&start=${start}&sort=sim`;

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

  assert(!response.ok, 'Failed to fetch data');

  return response.json();
};

export const fetchProducts = async (page = 1): Promise<ApiResponse> =>
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?page=${page}`,
  ).then((res) => res.json());
