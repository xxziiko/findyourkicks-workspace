import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';
import { groupBy } from 'es-toolkit';

export async function GET(req: Request) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page')) || 1;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json(
      { error: '사용자 조회 실패', details: userError?.message },
      { status: 500 },
    );
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders_view')
    .select('*')
    .eq('user_id', user.id)
    .order('order_date', { ascending: false })
    .range((page - 1) * 5, page * 5);

  if (ordersError) {
    console.error('ordersError', ordersError);
    return NextResponse.json(
      { error: '주문 조회 실패', details: ordersError.message },
      { status: 500 },
    );
  }

  const ordersView = orders.map(
    ({ order_id, order_date, order_item_id, ...product }) => ({
      orderId: order_id,
      orderDate: order_date,
      product: {
        id: order_item_id,
        ...product,
      },
    }),
  );

  const groupedOrders = groupBy(ordersView, (orders) => orders.orderId);

  return NextResponse.json({
    orders: groupedOrders,
    hasMore: orders.length === 6,
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { paymentKey, orderId, amount } = await req.json();

  // 1. 주문서 조회
  const { data: sheet, error: sheetError } = await supabase
    .from('order_sheets')
    .select('*')
    .eq('order_sheet_id', orderId)
    .single();

  if (sheetError || !sheet) {
    return NextResponse.json(
      { error: '주문서 조회 실패', details: sheetError?.message },
      { status: 404 },
    );
  }

  // 2. 결제 승인 요청 (Toss Payments API)
  const secretKey = process.env.TOSS_SECRET_KEY;
  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount: Number(amount),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json(
      { error: '결제 승인 실패', details: err },
      { status: 400 },
    );
  }

  const paymentResult = await res.json(); // 결제 승인 결과

  // 3. payments 테이블에 결제 정보 저장
  const { error: paymentInsertError } = await supabase.from('payments').insert({
    payment_id: paymentResult.paymentId,
    payment_method: paymentResult.method, // 카드, 가상계좌 등
    payment_easypay_provider: paymentResult.easyPay.provider,
    payment_key: paymentKey,
    amount: paymentResult.totalAmount,
    status: paymentResult.status,
    order_name: paymentResult.orderName,
    approved_at: new Date(paymentResult.approvedAt).toISOString(),
  });

  if (paymentInsertError) {
    return NextResponse.json(
      { error: '결제 정보 저장 실패', details: paymentInsertError.message },
      { status: 500 },
    );
  }

  // 4. orders 테이블에 주문 생성
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: sheet.user_id,
      order_sheet_id: orderId,
      address_id: sheet.user_address_id,
      total_amount: Number(amount),
      status: 'paid',
      order_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError || !newOrder) {
    return NextResponse.json(
      { error: '주문 생성 실패', details: orderError?.message },
      { status: 500 },
    );
  }

  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({ order_id: newOrder.order_id })
    .eq('payment_key', paymentKey);

  if (paymentUpdateError) {
    return NextResponse.json(
      { error: '결제 정보 업데이트 실패', details: paymentUpdateError.message },
      { status: 500 },
    );
  }

  // 5. order_sheet_item → order_items 복사
  const { data: items, error: itemError } = await supabase
    .from('order_sheet_items')
    .select('*')
    .eq('order_sheet_id', orderId);

  if (itemError || !items) {
    return NextResponse.json(
      { error: '주문 아이템 조회 실패', details: itemError?.message },
      { status: 500 },
    );
  }

  const orderItems = items.map((item) => ({
    order_id: newOrder.order_id,
    product_id: item.product_id,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: insertError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (insertError) {
    return NextResponse.json(
      { error: '주문 아이템 저장 실패', details: insertError.message },
      { status: 500 },
    );
  }

  // 6. 주문서 상태 업데이트
  const { error: statusError } = await supabase
    .from('order_sheets')
    .update({ status: 'completed' })
    .eq('order_sheet_id', orderId);

  if (statusError) {
    return NextResponse.json(
      { error: '주문서 상태 업데이트 실패', details: statusError.message },
      { status: 500 },
    );
  }

  // 7. 장바구니 삭제
  const cartItemIds = items.map((item) => item.cart_item_id);

  const { data: cart, error: cartError } = await supabase
    .from('cart')
    .select('cart_id')
    .eq('user_id', sheet.user_id)
    .single();

  if (cartError || !cart) {
    return NextResponse.json(
      { error: '장바구니 조회 실패', details: cartError?.message },
      { status: 500 },
    );
  }

  const { error: deleteError } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.cart_id)
    .in('cart_item_id', cartItemIds);

  if (deleteError) {
    console.error('장바구니 아이템 삭제 실패:', deleteError);
  }

  return NextResponse.json({
    message: '결제 및 주문 완료',
    orderId: newOrder.order_id,
  });
}
