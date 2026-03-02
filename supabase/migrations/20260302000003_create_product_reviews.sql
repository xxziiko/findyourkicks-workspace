-- ==============================================
-- 상품 리뷰 / 평점 시스템
-- ==============================================

-- 1. product_reviews 테이블 생성
CREATE TABLE IF NOT EXISTS public.product_reviews (
  review_id     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content       TEXT,
  image_urls    TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT uq_user_product_review UNIQUE (user_id, product_id),
  CONSTRAINT chk_content_length CHECK (content IS NULL OR char_length(content) <= 1000),
  CONSTRAINT chk_image_count CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 3)
);

COMMENT ON TABLE public.product_reviews IS '상품 리뷰 및 평점';

-- 2. 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.product_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_rating ON public.product_reviews(product_id, rating);

-- 3. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. RLS 정책
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- 누구나 리뷰 조회 가능
CREATE POLICY "reviews_select_all"
  ON public.product_reviews
  FOR SELECT
  USING (true);

-- 인증된 사용자만 리뷰 작성 가능
CREATE POLICY "reviews_insert_auth"
  ON public.product_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 리뷰만 수정 가능
CREATE POLICY "reviews_update_own"
  ON public.product_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 본인 리뷰만 삭제 가능
CREATE POLICY "reviews_delete_own"
  ON public.product_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. 상품별 평점 통계 뷰
CREATE OR REPLACE VIEW public.product_rating_summary AS
SELECT
  product_id,
  COUNT(*)::INT AS review_count,
  ROUND(AVG(rating)::NUMERIC, 1) AS average_rating,
  COUNT(*) FILTER (WHERE rating = 1)::INT AS rating_1,
  COUNT(*) FILTER (WHERE rating = 2)::INT AS rating_2,
  COUNT(*) FILTER (WHERE rating = 3)::INT AS rating_3,
  COUNT(*) FILTER (WHERE rating = 4)::INT AS rating_4,
  COUNT(*) FILTER (WHERE rating = 5)::INT AS rating_5
FROM public.product_reviews
GROUP BY product_id;

-- 6. 구매 여부 확인 RPC
CREATE OR REPLACE FUNCTION public.check_user_purchased_product(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.order_items oi ON o.order_id = oi.order_id
    WHERE o.user_id = p_user_id
      AND oi.product_id = p_product_id
      AND o.status IN ('paid', 'preparing', 'shipping', 'delivered')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_user_purchased_product IS '사용자가 해당 상품을 구매했는지 확인';

-- 7. 리뷰 중복 확인 RPC
CREATE OR REPLACE FUNCTION public.check_review_exists(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.product_reviews
    WHERE user_id = p_user_id
      AND product_id = p_product_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_review_exists IS '사용자가 이미 해당 상품에 리뷰를 작성했는지 확인';
