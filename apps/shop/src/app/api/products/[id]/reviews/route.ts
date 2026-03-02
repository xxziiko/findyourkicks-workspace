import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = Number(searchParams.get('limit') ?? '10');

  let query = supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', id)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    const { data: cursorReview } = await supabase
      .from('product_reviews')
      .select('created_at')
      .eq('review_id', cursor)
      .single();

    if (cursorReview) {
      query = query.lt('created_at', cursorReview.created_at);
    }
  }

  const { data: reviews, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: '리뷰 조회 실패', details: error.message },
      { status: 500 },
    );
  }

  const hasNext = reviews.length > limit;
  const items = hasNext ? reviews.slice(0, limit) : reviews;

  const mapped = items.map((r) => ({
    reviewId: r.review_id,
    userId: r.user_id,
    productId: r.product_id,
    rating: r.rating,
    content: r.content,
    imageUrls: r.image_urls ?? [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  return NextResponse.json({
    reviews: mapped,
    nextCursor: hasNext ? items[items.length - 1].review_id : null,
    hasNext,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { rating, content, imageUrls } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: '별점은 1~5 사이여야 합니다.' },
      { status: 400 },
    );
  }

  // 구매 여부 확인
  const { data: purchased } = await supabase.rpc(
    'check_user_purchased_product',
    {
      p_user_id: user.id,
      p_product_id: id,
    },
  );

  if (!purchased) {
    return NextResponse.json(
      { error: '구매한 상품만 리뷰를 작성할 수 있습니다.' },
      { status: 403 },
    );
  }

  // 중복 리뷰 확인
  const { data: exists } = await supabase.rpc('check_review_exists', {
    p_user_id: user.id,
    p_product_id: id,
  });

  if (exists) {
    return NextResponse.json(
      { error: '이미 리뷰를 작성하셨습니다.' },
      { status: 409 },
    );
  }

  const { data: review, error } = await supabase
    .from('product_reviews')
    .insert({
      user_id: user.id,
      product_id: id,
      rating,
      content: content ?? null,
      image_urls: imageUrls ?? [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: '리뷰 저장 실패', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ reviewId: review.review_id }, { status: 201 });
}
