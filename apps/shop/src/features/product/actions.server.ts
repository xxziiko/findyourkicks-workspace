import type { ProductDetail } from '@/features/product/types';
import { createClient } from '@/shared/utils/supabase/server';

/**
 * 서버 컴포넌트 전용 브랜드별 상품 조회
 * - SSR/빌드 시 HTTP API Route 대신 Supabase를 직접 호출
 */
export const fetchProductsByBrandServer = async (
  brand: string,
): Promise<ProductDetail[]> => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('product_with_details')
    .select('*')
    .limit(10)
    .order('product_id', { ascending: true })
    .eq('brand', brand);

  if (error || !products) return [];

  return products.map(({ product_id, ...product }) => ({
    productId: product_id,
    ...product,
  })) as ProductDetail[];
};
