import { fetchNaverData } from '@/app/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = Number.parseInt(searchParams.get('page') ?? '1', 10);

  const data = await fetchNaverData(start);

  if (!data) {
    throw new Error('데이터를 불러올 수 없습니다.');
  }
  const response = NextResponse.json({ data }, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  return response;
}
