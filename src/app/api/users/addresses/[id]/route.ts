import { createClient } from '@/shared/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('user_addresses')
    .update({ is_default: false })
    .eq('user_id', user.user?.id)
    .eq('is_default', true);

  if (error) {
    console.error('기본 배송지 초기화 실패', error);
    return NextResponse.json(
      { error: '기본 배송지 초기화 실패' },
      { status: 500 },
    );
  }

  const { error: updateDefaultAddressError } = await supabase
    .from('user_addresses')
    .update({ is_default: true })
    .eq('address_id', id);

  if (updateDefaultAddressError) {
    console.error('기본 배송지 설정 실패', updateDefaultAddressError);
    return NextResponse.json(
      { error: '기본 배송지 설정 실패' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: '기본 배송지 설정 완료' });
}
