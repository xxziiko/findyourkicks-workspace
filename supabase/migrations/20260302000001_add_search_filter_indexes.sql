-- ==============================================
-- 상품 검색 + 필터링을 위한 인덱스 및 DB 변경
-- ==============================================

-- 1. pg_trgm 확장 활성화 (ILIKE 성능 최적화)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. 검색용 trigram 인덱스 (title ILIKE '%keyword%' 가속)
CREATE INDEX IF NOT EXISTS idx_products_title_trgm
  ON products USING gin (title gin_trgm_ops);

-- 3. 필터링용 인덱스
CREATE INDEX IF NOT EXISTS idx_products_status_created
  ON products (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_price
  ON products (price);

CREATE INDEX IF NOT EXISTS idx_inventory_size
  ON inventory (size);

-- 4. 인기순 정렬을 위한 Materialized View
CREATE MATERIALIZED VIEW IF NOT EXISTS product_popularity AS
SELECT
  oi.product_id,
  COUNT(oi.order_item_id) AS order_count
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
GROUP BY oi.product_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_popularity_pid
  ON product_popularity (product_id);

-- 5. 인기도 새로고침 함수
CREATE OR REPLACE FUNCTION refresh_product_popularity()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_popularity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 필터 옵션 조회 RPC 함수
CREATE OR REPLACE FUNCTION get_filter_options()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'brands', (
      SELECT json_agg(json_build_object('id', brand_id::text, 'name', name))
      FROM brands
      ORDER BY name
    ),
    'categories', (
      SELECT json_agg(json_build_object('id', category_id::text, 'name', name))
      FROM categories
      ORDER BY name
    ),
    'sizes', (
      SELECT json_agg(DISTINCT size ORDER BY size)
      FROM inventory
      WHERE stock > 0
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
