import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';
import type { OrderHistory } from '@/features/order';
import { groupBy } from 'es-toolkit';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

interface OrderListFromSupabase {
  order_id: string;
  order_date: string;
  order_item_id: string;
  product_id: string;
  title: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  total_count: number;
}

/**
 * [GET] 주문 목록 조회
 *
 * - 인증된 사용자의 주문 목록을 페이지네이션하여 반환합니다.
 * - Supabase의 RPC 함수 `get_order_list`를 호출하여 주문 및 상품 정보를 가져옵니다.
 * - 주문 단위로 데이터를 그룹화하여 응답을 구성합니다.
 *
 * @param {Request} req - Next.js API Route 요청 객체
 * @returns {NextResponse<OrderHistory | { error: string; details?: string }>} - 주문 목록, 현재 페이지, 마지막 페이지, 다음 페이지 여부 포함
 */
export async function GET(
  req: Request,
): Promise<NextResponse<OrderHistory | { error: string; details?: string }>> {
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

  const {
    data: orderList,
    error,
  }: PostgrestSingleResponse<OrderListFromSupabase[]> = await supabase.rpc(
    'get_order_list',
    {
      p_user_id: user.id,
      p_limit: 3,
      p_page: page,
    },
  );

  if (error) {
    console.error('주문 조회 실패', error);
    return NextResponse.json(
      { error: '주문 조회 실패', details: error.message },
      { status: 500 },
    );
  }

  const grouped = groupBy(orderList, (row) => row.order_id);

  const orders = Object.entries(grouped).map(([orderId, items]) => ({
    orderId,
    orderDate: items[0].order_date,
    products: items.map(
      ({ order_item_id, title, image, size, price, quantity, product_id }) => ({
        id: order_item_id,
        productId: product_id,
        title,
        image,
        size,
        price,
        quantity,
        product_id,
      }),
    ),
  }));

  const totalCount = orderList[0]?.total_count ?? 0;
  const lastPage = Math.ceil(totalCount / 3);

  const response: OrderHistory = {
    orders,
    currentPage: page,
    lastPage,
    hasNext: page < lastPage,
  };

  return NextResponse.json(response);
}

/**
 * [POST] 주문 결제 처리 및 주문 생성
 *
 * - 1. 주문서 조회 (order_sheets)
 * - 2. TossPayments API를 통한 결제 승인 요청
 * - 3. 결제 정보 저장 (payments 테이블)
 * - 4. 주문 생성 (orders 테이블)
 * - 5. 주문 아이템 생성 (order_items 테이블로 복사)
 * - 6. 주문서 상태 업데이트 (completed)
 * - 7. 장바구니 아이템 삭제 (cart_items)
 * - 8. 재고 감소 처리 (decrease_stock RPC)
 *
 * @param {Request} req - 결제 요청 본문 (paymentKey, orderId, amount 포함)
 * @returns {NextResponse} - 처리 성공 시 주문 ID 포함 메시지 반환
 */
export async function POST(req: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    paymentKey,
    orderId,
    amount,
  }: { paymentKey: string; orderId: string; amount: number } = await req.json();

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

  // 8. 재고 감소
  console.log('paymentResult.status', paymentResult.status);
  if (paymentResult.status === 'DONE') {
    for (const item of items) {
      const { data, error } = await supabase.rpc('decrease_stock', {
        p_product_id: item.product_id,
        p_size: item.size,
        p_quantity: item.quantity,
      });

      if (data) {
        console.log('재고 감소 성공:', data);
      }

      if (error) {
        console.error('재고 감소 실패:', error);
      }
    }
  }

  return NextResponse.json({
    message: '결제 및 주문 완료',
    orderId: newOrder.order_id,
  });
}
