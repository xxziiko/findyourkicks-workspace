import { createClient } from '@/lib/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { name, phone, alias, address, userId } = await req.json();

  const { data: addressId, error: addressIdError } = await supabase
    .from('user_addresses')
    .select('address_id')
    .eq('user_id', userId)
    .single();

  if (addressIdError) {
    return NextResponse.json({ error: '주소 조회 실패' }, { status: 500 });
  }

  const { data: newAddress, error: newAddressError } = await supabase
    .from('user_addresses')
    .insert({
      receiver_name: name,
      receiver_phone: phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3'),
      alias,
      address,
      is_default: !addressId,
      user_id: userId,
    })
    .eq('address_id', addressId)
    .single();

  if (newAddressError) {
    return NextResponse.json({ error: '주소 생성 실패' }, { status: 500 });
  }

  return NextResponse.json(newAddress);
}
