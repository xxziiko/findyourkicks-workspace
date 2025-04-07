import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const payload = await req.json();

  const {
    orderSheetId,
    paymentMethod,
    userAddressId,
    termsAgreed,
    totalAmount,
  } = payload;

  // 주문서 정보 업데이트
  const { error: updateError } = await supabase
    .from('order_sheets')
    .update({
      payment_method: paymentMethod,
      user_address_id: userAddressId,
      terms_agreed: termsAgreed,
      total_amount: totalAmount,
      status: 'ready',
    })
    .eq('order_sheet_id', orderSheetId);

  if (updateError) {
    return NextResponse.json(
      { error: '주문서 업데이트 실패', details: updateError.message },
      { status: 500 },
    );
  }

  // payload에 delevery가 있다면 업데이트
  if (payload.delivery) {
    const { error: updateDeliveryError } = await supabase
      .from('user_addresses')
      .update(payload.delivery)
      .eq('address_id', userAddressId);

    if (updateDeliveryError) {
      return NextResponse.json(
        {
          error: '배송 정보 업데이트 실패',
          details: updateDeliveryError.message,
        },
        { status: 500 },
      );
    }
  }

  // 유저 정보 조회
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userInfo = {
    name: user.user_metadata.name,
    email: user.email,
    phone_number: user.user_metadata.phone_number,
  };

  return NextResponse.json({
    orderId: orderSheetId,
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    customerMobilePhone: userInfo.phone_number,
  });
}
