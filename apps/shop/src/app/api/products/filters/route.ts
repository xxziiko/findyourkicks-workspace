import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_filter_options');

  if (error) {
    return NextResponse.json(
      { error: '필터 옵션 조회 실패', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
