import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

const PAGE_SIZE = 30;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const brandParam = searchParams.get('brand');

  // 홈페이지 브랜드 섹션용: brand 단독 파라미터 (콤마 없음, 다른 검색 파라미터 없음)
  const hasQuery = !!searchParams.get('q');
  const hasCategoryFilter = !!searchParams.get('category');
  const hasSizeFilter = !!searchParams.get('size');
  const hasPriceFilter =
    !!searchParams.get('minPrice') || !!searchParams.get('maxPrice');
  const hasSort = searchParams.get('sort') !== null;
  const hasPage = searchParams.get('page') !== null;
  const isBrandFilterOnly = !!brandParam && !brandParam.includes(',');

  const isHomeBrandSection =
    isBrandFilterOnly &&
    !hasQuery &&
    !hasCategoryFilter &&
    !hasSizeFilter &&
    !hasPriceFilter &&
    !hasSort &&
    !hasPage;

  if (isHomeBrandSection) {
    const { data: products, error } = await supabase
      .from('product_with_details')
      .select('*')
      .limit(10)
      .order('product_id', { ascending: true })
      .eq('brand', brandParam);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const response = products.map(({ product_id, ...product }) => ({
      productId: product_id,
      ...product,
    }));

    return NextResponse.json(response);
  }

  // 검색/필터/정렬 포함 전체 목록 조회
  const q = searchParams.get('q');
  const brands = brandParam?.split(',').filter(Boolean);
  const categories = searchParams.get('category')?.split(',').filter(Boolean);
  const sizes = searchParams.get('size')?.split(',').filter(Boolean);
  const minPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : null;
  const maxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : null;
  const sort = searchParams.get('sort') ?? 'latest';
  const page = Number(searchParams.get('page') ?? '1');

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 사이즈 필터: inventory 서브쿼리
  let filteredProductIds: string[] | null = null;
  if (sizes && sizes.length > 0) {
    const { data: sizeItems } = await supabase
      .from('inventory')
      .select('product_id')
      .in('size', sizes)
      .gt('stock', 0);

    if (!sizeItems || sizeItems.length === 0) {
      return NextResponse.json([]);
    }

    filteredProductIds = [...new Set(sizeItems.map((i) => i.product_id))];
  }

  let query = supabase
    .from('product_with_details')
    .select('*')
    .eq('status', 'selling');

  if (q) {
    query = query.or(`title.ilike.%${q}%,brand.ilike.%${q}%`);
  }

  if (brands && brands.length > 0) {
    query = query.in('brand', brands);
  }

  if (categories && categories.length > 0) {
    query = query.in('category', categories);
  }

  if (minPrice !== null) {
    query = query.gte('price', minPrice);
  }

  if (maxPrice !== null) {
    query = query.lte('price', maxPrice);
  }

  if (filteredProductIds) {
    query = query.in('product_id', filteredProductIds);
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    default:
      query = query
        .order('created_at', { ascending: false })
        .order('product_id', { ascending: true });
      break;
  }

  query = query.range(from, to);

  const { data: products, error } = await query;

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const response = products.map(({ product_id, ...product }) => ({
    productId: product_id,
    ...product,
  }));

  return NextResponse.json(response);
}
