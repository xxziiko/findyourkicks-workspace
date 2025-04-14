import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const limit = 30;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      product_id,
      title,
      price,
      image,
      brand:brands!fk_product_brand (
        name
      ),
      category:categories!products_category_id_fkey (
        name
      )
    `)
    .range(from, to)
    .order('product_id', { ascending: true });

  if (error) return NextResponse.json({ error }, { status: 500 });

  const response = products.map(
    ({ product_id, title, price, image, brand, category }) => ({
      productId: product_id,
      title,
      price,
      image,
      brand: brand[0]?.name ?? '',
      category: category[0]?.name ?? '',
    }),
  );

  return NextResponse.json(response);
}
