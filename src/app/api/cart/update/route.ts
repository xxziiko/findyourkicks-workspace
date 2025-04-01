import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

type UpdateQuantityRequest = {
  cart_item_id: string;
  quantity: number;
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = (await req.json()) as UpdateQuantityRequest;

  const { cart_item_id, quantity } = body;

  // 유효성 검사
  if (!cart_item_id || typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  // 유저 인증
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: '인증되지 않은 사용자입니다.' },
      { status: 401 },
    );
  }

  const { data: cartItem, error: itemError } = await supabase
    .from('cart_items')
    .select(
      `
      cart_item_id,
      cart_id,
      inventory:inventory_id(size, stock),
      cart:cart_id(user_id)
    `,
    )
    .eq('cart_item_id', cart_item_id)
    .maybeSingle();

  if (itemError || !cartItem) {
    return NextResponse.json(
      { error: '해당 장바구니 항목을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }
  console.log('cartItem', cartItem);
  // 재고 초과 여부 확인
  const availableStock = cartItem.inventory[0]?.stock;
  if (quantity > availableStock) {
    return NextResponse.json(
      { error: '구매 가능한 수량을 초과했어요!' },
      { status: 400 },
    );
  }

  // 수량 업데이트
  const { data: updated, error: updateError } = await supabase
    .from('cart_items')
    .update({
      quantity,
      added_at: new Date().toISOString(),
    })
    .eq('cart_item_id', cart_item_id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: '수량 업데이트에 실패했습니다.' },
      { status: 500 },
    );
  }

  return NextResponse.json(updated);
}
