import type { OrderSheet } from '@/features/order-sheet';
import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = (await req.json()) as OrderSheet[];

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: authError?.status },
    );
  }

  const { data: defaultAddress, error: defaultAddressError } = await supabase
    .from('user_addresses')
    .select('address_id')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .single();

  if (defaultAddressError) {
    // 없으면 초기 고객
    console.error('defaultAddressError', defaultAddressError);
  }

  // 1. 주문서 생성
  const { data: orderSheet, error: orderSheetError } = await supabase
    .from('order_sheets')
    .insert({
      user_id: user.id,
      status: 'pending',
      user_address_id: defaultAddress?.address_id,
      created_at: new Date().toISOString(),
    })
    .select('order_sheet_id')
    .single();

  if (orderSheetError || !orderSheet) {
    console.error('orderSheetError', orderSheetError);
    return NextResponse.json({ error: '주문서 생성 실패' }, { status: 500 });
  }

  const orderSheetId = orderSheet.order_sheet_id;

  // 2. 주문 아이템 생성
  const orderItems = body.map(({ productId, id, size, price, quantity }) => ({
    order_sheet_id: orderSheetId,
    product_id: productId,
    cart_item_id: id,
    size,
    price,
    quantity,
    created_at: new Date().toISOString(),
  }));

  const { error: insertError } = await supabase
    .from('order_sheet_items')
    .insert(orderItems);

  if (insertError) {
    console.error('insertError', insertError);
    return NextResponse.json(
      { error: '주문 아이템 생성 실패' },
      { status: 500 },
    );
  }

  return NextResponse.json({ orderSheetId });
}
