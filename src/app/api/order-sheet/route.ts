import type { OrderSheetList } from '@/features/order-sheet/types';
import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = (await req.json()) as OrderSheetList;

  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  // 요청

  const { data: defaultAddress } = await supabase
    .from('user_addresses')
    .select('address_id')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  // 1. 주문서 생성
  const { data: orderSheet, error: orderSheetError } = await supabase
    .from('order_sheets')
    .insert({
      user_id: userId,
      status: 'pending',
      user_address_id: defaultAddress?.address_id,
      created_at: new Date().toISOString(),
    })
    .select('order_sheet_id')
    .single();

  if (orderSheetError || !orderSheet) {
    return NextResponse.json({ error: '주문서 생성 실패' }, { status: 500 });
  }

  const orderSheetId = orderSheet.order_sheet_id;

  // 2. 주문 아이템 생성
  const orderItems = body.map(
    ({ productId, cartItemId, size, price, quantity }) => ({
      order_sheet_id: orderSheetId,
      product_id: productId,
      cart_item_id: cartItemId,
      size,
      price,
      quantity,
      created_at: new Date().toISOString(),
    }),
  );

  const { error: insertError } = await supabase
    .from('order_sheet_items')
    .insert(orderItems);

  if (insertError) {
    return NextResponse.json(
      { error: '주문 아이템 생성 실패' },
      { status: 500 },
    );
  }

  return NextResponse.json({ orderSheetId });
}
