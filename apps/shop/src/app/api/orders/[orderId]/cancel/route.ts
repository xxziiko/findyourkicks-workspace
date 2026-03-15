import { mapRpcError } from '@/shared/utils/rpcError';
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

  const { reason } = await req.json();

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

  if (!['paid', 'preparing'].includes(order.status)) {
    return NextResponse.json(
      { error: '현재 상태에서는 취소할 수 없습니다.' },
      { status: 400 },
    );
  }

  // payment_key 조회
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('payment_key')
    .eq('order_id', orderId)
    .single();

  if (paymentError || !payment) {
    return NextResponse.json(
      { error: '결제 정보를 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  // Toss Payments 취소 API 호출
  const secretKey = process.env.TOSS_SECRET_KEY;
  const tossRes = await fetch(
    `https://api.tosspayments.com/v1/payments/${payment.payment_key}/cancel`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancelReason: reason ?? '고객 취소' }),
    },
  );

  if (!tossRes.ok) {
    const err = await tossRes.json();
    return NextResponse.json(
      { error: '결제 취소 실패', details: err },
      { status: 400 },
    );
  }

  const tossData = await tossRes.json();

  // 단일 RPC로 원자적 처리: 주문 상태 + 취소 기록 + 재고 복원
  const { error: rpcError } = await supabase.rpc('cancel_order_after_toss', {
    p_order_id: orderId,
    p_reason: reason ?? '고객 취소',
    p_cancel_request_id: crypto.randomUUID(),
    p_toss_cancel_transaction_key: tossData.cancels?.[0]?.transactionKey ?? '',
    p_toss_canceled_at:
      tossData.cancels?.[0]?.canceledAt ?? new Date().toISOString(),
    p_toss_raw: tossData,
  });

  if (rpcError) {
    const mapped = mapRpcError(rpcError);
    return NextResponse.json(
      { error: mapped.error },
      { status: mapped.status },
    );
  }

  return NextResponse.json({ message: '주문이 취소되었습니다.' });
}
