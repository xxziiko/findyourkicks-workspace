import { fetchNaverData } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = Number.parseInt(searchParams.get('page') ?? '1', 10);

  const data = await fetchNaverData(start);

  if (!data) {
    return NextResponse.json(
      { error: '데이터를 불러올 수 없습니다.' },
      { status: 500 },
    );
  }

  return new NextResponse(JSON.stringify({ data }), { status: 200 });
}
