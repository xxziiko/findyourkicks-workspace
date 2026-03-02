import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ canReview: false, reason: 'NOT_PURCHASED' });
  }

  const { data: purchased } = await supabase.rpc(
    'check_user_purchased_product',
    {
      p_user_id: user.id,
      p_product_id: id,
    },
  );

  if (!purchased) {
    return NextResponse.json({ canReview: false, reason: 'NOT_PURCHASED' });
  }

  const { data: exists } = await supabase.rpc('check_review_exists', {
    p_user_id: user.id,
    p_product_id: id,
  });

  if (exists) {
    return NextResponse.json({ canReview: false, reason: 'ALREADY_REVIEWED' });
  }

  return NextResponse.json({ canReview: true });
}
