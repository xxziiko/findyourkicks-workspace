import { createClient } from '@/lib/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: address, error: addressError } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.user?.id)
    .eq('is_default', true)
    .single();

  if (addressError) {
    return NextResponse.json({ error: '주소 조회 실패' }, { status: 500 });
  }

  const response = {
    addressId: address.address_id,
    receiverName: address.receiver_name,
    receiverPhone: address.receiver_phone,
    alias: address.alias,
    address: address.address,
    isDefault: address.is_default,
    message: address.message,
  };

  return NextResponse.json(response);
}
