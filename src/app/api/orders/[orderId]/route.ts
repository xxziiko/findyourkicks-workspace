import { createClient } from '@/shared/utils/supabase/server';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    return NextResponse.json({ error: '결제 정보 조회 실패' }, { status: 500 });
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId);

  if (ordersError) {
    return NextResponse.json(
      { error: '주문 아이템 조회 실패' },
      { status: 500 },
    );
  }

  const { data: addresses, error: addressesError } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('address_id', orders[0].address_id);

  if (addressesError) {
    console.log('addressesError', addressesError);
    return NextResponse.json({ error: '주문 주소 조회 실패' }, { status: 500 });
  }

  const response = {
    orderId,
    orderDate: dayjs(orders[0].order_date).format('YYYY-MM-DD HH:mm:ss'),

    payment: {
      paymentKey: payment[0].payment_key,
      paymentMethod: payment[0].payment_method,
      paymentEasypayProvider: payment[0].payment_easypay_provider,
      orderName: payment[0].order_name,
      amount: payment[0].amount,
    },
    address: {
      receiverName: addresses[0].receiver_name,
      receiverPhone: addresses[0].receiver_phone,
      address: addresses[0].address,
      message: addresses[0].message,
    },
  };

  return NextResponse.json(response);
}
