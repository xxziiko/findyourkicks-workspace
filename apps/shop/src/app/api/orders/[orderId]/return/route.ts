import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { returnType, reason, details } = await req.json();

  if (!returnType || !reason) {
    return NextResponse.json(
      { error: '반품 유형과 사유를 입력해 주세요.' },
      { status: 400 },
    );
  }

  // 주문 조회 및 소유권 확인
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: '주문을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  if (order.user_id !== user.id) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  if (order.status !== 'delivered') {
    return NextResponse.json(
      { error: '배송 완료된 주문만 반품/교환 신청이 가능합니다.' },
      { status: 400 },
    );
  }

  // 7일 이내 확인
  const orderDate = new Date(order.order_date);
  const now = new Date();
  const diffDays =
    (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays > 7) {
    return NextResponse.json(
      { error: '배송 완료 후 7일이 지나 반품/교환 신청이 불가합니다.' },
      { status: 400 },
    );
  }

  const newStatus =
    returnType === 'exchange' ? 'exchange_requested' : 'return_requested';

  // 반품/교환 기록 저장
  const { error: returnError } = await supabase.from('order_returns').insert({
    order_id: orderId,
    return_type: returnType,
    reason,
    details: details ?? null,
    status: 'requested',
  });

  if (returnError) {
    return NextResponse.json(
      { error: '반품/교환 신청 저장 실패', details: returnError.message },
      { status: 500 },
    );
  }

  // 주문 상태 업데이트
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('order_id', orderId);

  if (updateError) {
    return NextResponse.json(
      { error: '주문 상태 업데이트 실패', details: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message:
      returnType === 'exchange'
        ? '교환 신청이 접수되었습니다.'
        : '반품 신청이 접수되었습니다.',
  });
}
