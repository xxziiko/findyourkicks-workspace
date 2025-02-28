import { fetchNaverData } from '@/app/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = Number.parseInt(searchParams.get('page') ?? '1', 10);

  try {
    const data = await fetchNaverData(start);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
