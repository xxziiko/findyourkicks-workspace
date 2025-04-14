import { createClient } from '@/shared/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { name, phone, alias, address } = await req.json();

  const { data: user, error: userError } = await supabase.auth.getUser();
  const { data: addressId, error: addressIdError } = await supabase
    .from('user_addresses')
    .select('address_id')
    .eq('user_id', user.user?.id)
    .eq('is_default', true);

  if (addressIdError) {
    console.error('주소 조회 실패', addressIdError);
    return NextResponse.json({ error: '주소 조회 실패' }, { status: 500 });
  }

  if (addressId.length > 0) {
    const { error: updateDefaultAddressError } = await supabase
      .from('user_addresses')
      .update({
        is_default: false,
      })
      .eq('address_id', addressId[0].address_id);

    if (updateDefaultAddressError) {
      console.error('기본 배송지 초기화 실패', updateDefaultAddressError);
      return NextResponse.json(
        { error: '기본 배송지 초기화 실패' },
        { status: 500 },
      );
    }
  }

  const { data: newAddress, error: newAddressError } = await supabase
    .from('user_addresses')
    .insert({
      receiver_name: name,
      receiver_phone: phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      alias,
      address,
      is_default: true,
      user_id: user.user?.id,
    })
    .eq('address_id', addressId)
    .single();

  if (newAddressError) {
    console.error('주소 생성 실패', newAddressError);
    return NextResponse.json({ error: '주소 생성 실패' }, { status: 500 });
  }

  const response = {
    message: '주소 생성 성공',
    // newAddress,
  };

  return NextResponse.json(response);
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const { data: addresses, error: addressesError } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', data.user?.id);

  if (addressesError) {
    return NextResponse.json({ error: '주소 조회 실패' }, { status: 500 });
  }

  const response = addresses
    .sort((a, b) => b.is_default - a.is_default)
    .map(
      ({
        address_id,
        receiver_name,
        receiver_phone,
        alias,
        address,
        message,
        is_default,
      }) => ({
        addressId: address_id,
        receiverName: receiver_name,
        receiverPhone: receiver_phone,
        alias,
        address,
        message,
        isDefault: is_default,
      }),
    );

  return NextResponse.json(response);
}
