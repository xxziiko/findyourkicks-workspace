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

  const { returnType, reason, details } = await req.json();

  if (!returnType || !reason) {
    return NextResponse.json(
      { error: '반품 유형과 사유를 입력해 주세요.' },
      { status: 400 },
    );
  }

  // 단일 RPC로 원자적 처리: 소유권·상태·기간 검증 + 반품 기록 INSERT + 주문 상태 UPDATE
  const { error: rpcError } = await supabase.rpc('request_return_for_order', {
    p_order_id: orderId,
    p_return_type: returnType,
    p_reason: reason,
    p_details: details ?? null,
  });

  if (rpcError) {
    const mapped = mapRpcError(rpcError);
    return NextResponse.json(
      { error: mapped.error },
      { status: mapped.status },
    );
  }

  return NextResponse.json({
    message:
      returnType === 'exchange'
        ? '교환 신청이 접수되었습니다.'
        : '반품 신청이 접수되었습니다.',
  });
}
