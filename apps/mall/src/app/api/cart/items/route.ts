import type { CartListPayload } from '@/features/cart/types';
import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

interface CartItemsResponse {
  cart_item_id: string;
  product_id: string;
  inventory_id: string;
  quantity: number;
  price: number;
  added_at: string;
  size: string;
  stock: number;
  title: string;
  image: string;
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 },
    );
  }

  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items_with_details')
    .select('*')
    .eq('user_id', user.id);

  if (cartError || !cartItems) {
    console.error('장바구니 조회 실패', cartError);
    return NextResponse.json([]);
  }

  const response =
    cartItems
      .sort((a, b) => a.cart_item_id.localeCompare(b.cart_item_id))
      .map(
        ({
          user_id,
          product_id,
          cart_item_id,
          added_at,
          size,
          stock,
          ...item
        }) => ({
          userId: user_id,
          productId: product_id,
          cartItemId: cart_item_id,
          addedAt: added_at,
          selectedOption: {
            size,
            stock,
          },
          ...item,
        }),
      ) ?? [];

  return NextResponse.json(response);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const payload: CartListPayload = await req.json();
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

  // 1. 사용자 cart 확인 또는 생성
  const { data: existingCart } = await supabase
    .from('cart')
    .select('cart_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let cartId = existingCart?.cart_id;

  if (!cartId) {
    const { data: newCart, error: newCartError } = await supabase
      .from('cart')
      .insert({
        user_id: user.id,
        create_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (newCartError || !newCart) {
      return NextResponse.json({ error: '카트 생성 실패' }, { status: 500 });
    }

    cartId = newCart.cart_id;
  }

  // const insertedItems = [];

  // item: { product_id, inventory_id, quantity, price }
  for (const item of payload) {
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

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', item.product_id)
      .eq('inventory_id', inventory.inventory_id)
      .maybeSingle();

    if (existingItem) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + item.quantity,
          added_at: new Date().toISOString(),
        })
        .eq('cart_item_id', existingItem.cart_item_id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: '장바구니 업데이트 실패', updateError },
          { status: 500 },
        );
      }

      // if (updated) insertedItems.push(updated);
      continue;
    }

    const { error: insertError } = await supabase
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

    if (insertError) {
      return NextResponse.json(
        { error: '장바구니 추가 실패', insertError },
        { status: 500 },
      );
    }

    // if (inserted) insertedItems.push(inserted);
  }

  return NextResponse.json({
    message: '장바구니에 상품이 추가되었습니다.',
  });
}
