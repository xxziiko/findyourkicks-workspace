import { createClient } from '@/lib/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const { id } = await params;
  const { quantity } = await req.json();

  if (typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json(
      { error: '수량은 1 이상이어야 합니다.' },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity, added_at: new Date().toISOString() })
    .eq('cart_item_id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: '수량 수정 실패', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: '수량이 업데이트되었습니다.',
    item: data,
  });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const { id } = await params;

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_item_id', id);

  if (error) {
    return NextResponse.json(
      { error: '삭제 실패', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: '장바구니에서 삭제되었습니다.' });
}
