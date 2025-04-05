import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export interface OrderSheetItemPayload {
  productId: string;
  size: string;
  price: number;
  quantity: number;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const request = await req.json();

  const { userId, body } = request;
  // 요청

  // TODO: 주문서 존재 여부 확인
  // const { data: existingOrderSheet } = await supabase
  //   .from('order_sheets')
  //   .select('order_sheet_id')
  //   .eq('user_id', userId)
  //   .eq('status', 'pending')
  //   .single();

  // if (existingOrderSheet) {
  //   return NextResponse.json({
  //     orderSheetId: existingOrderSheet.order_sheet_id,
  //   });
  // }

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
  const results = await Promise.all(
    body.map((item: OrderSheetItemPayload) => {
      const body = {
        order_sheet_id: orderSheetId,
        product_id: item.productId,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
      };

      return supabase.from('order_sheet_items').insert(body);
    }),
  );

  const itemError = await results.find((result) => result.error)?.error;

  if (itemError) {
    return NextResponse.json(
      { error: '주문 아이템 생성 실패' },
      { status: 500 },
    );
  }

  return NextResponse.json({ orderSheetId });
}
