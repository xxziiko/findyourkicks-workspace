import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ returnId: string }> },
): Promise<NextResponse> {
  const { returnId } = await params;
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

  const { data: returnRecord, error: returnError } = await supabase
    .from('order_returns')
    .select('return_id, order_id, status')
    .eq('return_id', returnId)
    .single();

  if (returnError || !returnRecord) {
    return NextResponse.json(
      { error: '반품/교환 요청을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  if (returnRecord.status !== 'requested') {
    return NextResponse.json(
      { error: '이미 처리된 요청입니다.' },
      { status: 400 },
    );
  }

  const { error: updateReturnError } = await supabase
    .from('order_returns')
    .update({ status: 'rejected' })
    .eq('return_id', returnId);

  if (updateReturnError) {
    return NextResponse.json(
      {
        error: '반품/교환 상태 업데이트 실패',
        details: updateReturnError.message,
      },
      { status: 500 },
    );
  }

  const { error: updateOrderError } = await supabase
    .from('orders')
    .update({ status: 'delivered' })
    .eq('order_id', returnRecord.order_id);

  if (updateOrderError) {
    return NextResponse.json(
      { error: '주문 상태 복원 실패', details: updateOrderError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: '반품/교환 요청이 거부되었습니다.' });
}
