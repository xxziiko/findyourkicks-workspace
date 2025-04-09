import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export interface OrderSheetResponse {
  orderSheetId: string;
  orderSheetItems: OrderSheetItem[];
  delivery: Address;
}

export interface Address {
  addressId: string;
  alias: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  message: string;
}

export type OrderSheetItem = {
  productId: string;
  cartItemId: string;
  title: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
};

export type RawDelivery = {
  address_id: number;
  alias: string;
  receiver_name: string;
  receiver_phone: string;
  address: string;
  message: string;
  is_default: boolean;
};

interface RawOrderSheetItem {
  product_id: string;
  cart_item_id: string;
  size: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    image: string;
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: orderSheetId } = await params;

  // 2. 주문 아이템 조회
  const { data: rawOrderSheetItems, error: itemsError } = await supabase
    .from('order_sheet_items')
    .select(`
      product_id,
      size,
      quantity,
      price,
      cart_item_id,
      product:product_id (
        title,
        image
      )
    `)
    .eq('order_sheet_id', orderSheetId);

  if (itemsError || !rawOrderSheetItems) {
    // console.log('rawOrderSheetItems', rawOrderSheetItems);

    return NextResponse.json(
      { error: '주문 아이템을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  // console.log('rawOrderSheetItems', rawOrderSheetItems);

  // 3. 배송 정보 조회
  const { data: rawDelivery } = await supabase
    .from('order_sheets')
    .select(`
      user_address:user_address_id (
      address_id,
      alias,
      receiver_name,
      receiver_phone,
      address,
      message,
      is_default
    )
    `)
    .eq('order_sheet_id', orderSheetId)
    .single<{ user_address: RawDelivery }>();

  if (!rawDelivery) {
    // console.log('rawDelivery', rawDelivery);

    return NextResponse.json({ error: '배송 정보가 존재하지 않습니다.' });
  }

  const orderSheetItems = (
    rawOrderSheetItems as unknown as RawOrderSheetItem[]
  ).map((item) => ({
    productId: item.product_id,
    cartItemId: item.cart_item_id,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
    title: item.product.title,
    image: item.product.image,
  }));

  const response = {
    orderSheetId,
    orderSheetItems,
    delivery: {
      addressId: rawDelivery?.user_address?.address_id ?? null,
      alias: rawDelivery?.user_address?.alias ?? null,
      receiverName: rawDelivery?.user_address?.receiver_name ?? null,
      receiverPhone: rawDelivery?.user_address?.receiver_phone ?? null,
      address: rawDelivery?.user_address?.address ?? null,
      message: rawDelivery?.user_address?.message ?? null,
      isDefault: rawDelivery?.user_address?.is_default ?? null,
    },
  };

  return NextResponse.json(response);
}
