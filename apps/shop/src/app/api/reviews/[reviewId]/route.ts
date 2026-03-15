import { extractStoragePath } from '@/shared/utils/storageUtils';
import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const { rating, content, imageUrls } = await req.json();

  const updateData: Record<string, unknown> = {};
  if (rating !== undefined) updateData.rating = rating;
  if (content !== undefined) updateData.content = content;
  if (imageUrls !== undefined) updateData.image_urls = imageUrls;

  const { data: review, error } = await supabase
    .from('product_reviews')
    .update(updateData)
    .eq('review_id', reviewId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: '리뷰 수정 실패', details: error.message },
      { status: 500 },
    );
  }

  if (!review) {
    return NextResponse.json(
      { error: '리뷰를 찾을 수 없거나 권한이 없습니다.' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    reviewId: review.review_id,
    rating: review.rating,
    content: review.content,
    imageUrls: review.image_urls,
    updatedAt: review.updated_at,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  // 리뷰 조회 (이미지 URL 확인용)
  const { data: review } = await supabase
    .from('product_reviews')
    .select('image_urls')
    .eq('review_id', reviewId)
    .eq('user_id', user.id)
    .single();

  if (!review) {
    return NextResponse.json(
      { error: '리뷰를 찾을 수 없거나 권한이 없습니다.' },
      { status: 404 },
    );
  }

  // Storage 이미지 삭제
  if (review.image_urls && review.image_urls.length > 0) {
    const paths = review.image_urls
      .map((url: string) => extractStoragePath(url, 'review-images'))
      .filter(Boolean);

    if (paths.length > 0) {
      await supabase.storage.from('review-images').remove(paths);
    }
  }

  const { error } = await supabase
    .from('product_reviews')
    .delete()
    .eq('review_id', reviewId)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json(
      { error: '리뷰 삭제 실패', details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: '리뷰가 삭제되었습니다.' });
}
