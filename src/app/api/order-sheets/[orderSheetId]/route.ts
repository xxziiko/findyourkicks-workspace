import { getCookieString } from '@/shared/utils';
import { createClient } from '@/shared/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderSheetId: string }> },
) {
  const { orderSheetId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. 주문 아이템 조회
  const { data: orderSheetItems, error: itemsError } = await supabase
    .from('order_sheet_item_with_details')
    .select('*')
    .eq('order_sheet_id', orderSheetId);

  if (itemsError || !orderSheetItems) {
    console.error('주문 아이템 조회 실패:', itemsError);
    return NextResponse.json(
      { error: '주문 아이템을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  const orderSheetItemsResponse = orderSheetItems.map(
    ({
      user_id,
      product_id,
      cart_item_id,
      added_at,
      size,
      quantity,
      ...item
    }) => ({
      ...item,
      productId: product_id,
      cartItemId: cart_item_id,
      addedAt: added_at,
      size,
      quantity,
    }),
  );

  // 3. 배송 정보 조회
  const { data: addressData, error: deliveryError } = await supabase
    .from('order_sheet_with_address')
    .select('*')
    .eq('order_sheet_id', orderSheetId)
    .maybeSingle();

  if (deliveryError) {
    console.error('배송 정보 조회 실패', deliveryError);
    return NextResponse.json({
      error: '배송 정보를 찾을 수 없습니다.',
      status: 404,
    });
  }

  if (!addressData) {
    return NextResponse.json({
      orderSheetId,
      orderSheetItems: orderSheetItemsResponse,
      deliveryAddress: null,
    });
  }

  const {
    address_id,
    receiver_name,
    receiver_phone,
    is_default,
    alias,
    address,
    message,
  } = addressData;

  return NextResponse.json({
    orderSheetId,
    orderSheetItems: orderSheetItemsResponse,
    deliveryAddress: {
      addressId: address_id,
      receiverName: receiver_name,
      receiverPhone: receiver_phone,
      isDefault: is_default,
      alias,
      address,
      message,
    },
  });
}
