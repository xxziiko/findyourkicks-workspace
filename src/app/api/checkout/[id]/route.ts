import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export interface OrderSheetResponse {
  orderSheetId: string;
  orderSheetItems: OrderSheetItem[];
  deliveryInfo: Address;
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
};

interface RawOrderSheetItem {
  product_id: string;
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
  const { data: rawDeliveryInfo } = await supabase
    .from('order_sheets')
    .select(`
      user_address:user_address_id (
      address_id,
      alias,
      receiver_name,
      receiver_phone,
      address,
      message
    )
    `)
    .eq('order_sheet_id', orderSheetId)
    .single<{ user_address: RawDelivery }>();

  if (!rawDeliveryInfo) {
    // console.log('deliveryInfo', rawDeliveryInfo);

    return NextResponse.json({ error: '배송 정보가 존재하지 않습니다.' });
  }

  const orderSheetItems = (
    rawOrderSheetItems as unknown as RawOrderSheetItem[]
  ).map((item) => ({
    productId: item.product_id,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
    title: item.product.title,
    image: item.product.image,
  }));

  const response = {
    orderSheetId,
    orderSheetItems,
    deliveryInfo: {
      addressId: rawDeliveryInfo?.user_address?.address_id,
      alias: rawDeliveryInfo?.user_address?.alias,
      receiverName: rawDeliveryInfo?.user_address?.receiver_name,
      receiverPhone: rawDeliveryInfo?.user_address?.receiver_phone,
      address: rawDeliveryInfo?.user_address?.address,
      message: rawDeliveryInfo?.user_address?.message,
    },
  };

  return NextResponse.json(response);
}
