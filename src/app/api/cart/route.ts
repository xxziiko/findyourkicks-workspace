import type { AddCartRequest } from '@/lib/api';
import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const payload: AddCartRequest[] = await req.json();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = userData.user.id;

  // 1. 사용자 cart 확인 또는 생성
  const { data: existingCart } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  let cartId = existingCart?.cart_id;

  if (!cartId) {
    const { data: newCart, error: newCartError } = await supabase
      .from('cart')
      .insert({
        user_id: userId,
        create_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (newCartError || !newCart) {
      return NextResponse.json({ error: '카트 생성 실패' }, { status: 500 });
    }

    cartId = newCart.cart_id;
  }

  const insertedItems = [];

  for (const item of payload) {
    // item: { product_id, inventory_id, quantity, price }

    //  해당 inventory의 재고를 확인
    const { data: inventory, error: invError } = await supabase
      .from('inventory')
      .select('inventory_id, stock')
      .eq('product_id', item.product_id)
      .eq('size', item.size)
      .single();

    if (invError || !inventory) {
      return NextResponse.json(
        { error: '재고 정보를 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    // 2. 기존 cart_item 있는지 확인
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', item.product_id)
      .eq('inventory_id', inventory.inventory_id)
      .maybeSingle();

    if (existingItem) {
      const { data: updated } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + item.quantity,
          added_at: new Date().toISOString(),
        })
        .eq('cart_item_id', existingItem.cart_item_id)
        .select()
        .single();

      if (updated) insertedItems.push(updated);
      continue;
    }

    const { data: inserted } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cartId,
        product_id: item.product_id,
        inventory_id: inventory.inventory_id,
        quantity: item.quantity,
        price: item.price,
        added_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (inserted) insertedItems.push(inserted);
  }

  return NextResponse.json({
    message: '장바구니에 상품이 추가되었습니다.',
    items: insertedItems,
  });
}
