import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

type RawDelivery = {
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
  { params }: { params: Promise<{ orderSheetId: string }> },
) {
  try {
    const supabase = await createClient();
    const { orderSheetId } = await params;

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('인증 실패:', authError);
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

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
      console.error('주문 아이템 조회 실패:', itemsError);
      return NextResponse.json(
        { error: '주문 아이템을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

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
      console.error('배송 정보 조회 실패');
      return NextResponse.json(
        { error: '배송 정보가 존재하지 않습니다.' },
        { status: 404 },
      );
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
      deliveryAddress: {
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
  } catch (error) {
    console.error('주문서 조회 중 에러 발생:', error);
    return NextResponse.json(
      { error: '주문서 조회 중 에러가 발생했습니다.' },
      { status: 500 },
    );
  }
}
