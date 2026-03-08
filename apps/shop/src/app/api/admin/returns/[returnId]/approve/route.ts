import { mapRpcError } from '@/shared/utils/rpcError';
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

  // 단일 RPC로 원자적 처리: 반품 상태 + 주문 상태 동시 업데이트
  const { error: rpcError } = await supabase.rpc('approve_return_request', {
    p_return_id: returnId,
  });

  if (rpcError) {
    const mapped = mapRpcError(rpcError);
    return NextResponse.json(
      { error: mapped.error },
      { status: mapped.status },
    );
  }

  return NextResponse.json({ message: '반품/교환 요청이 승인되었습니다.' });
}
