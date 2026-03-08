import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request): Promise<NextResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  let query = supabase
    .from('order_returns')
    .select(
      `
      return_id,
      order_id,
      return_type,
      reason,
      details,
      status,
      created_at,
      orders (
        order_id,
        status,
        total_amount,
        order_date,
        user_id,
        order_items (
          product_id,
          size,
          quantity,
          price,
          products (
            title
          )
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: '반품/교환 목록 조회 실패', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}
