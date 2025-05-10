import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);

  const brand = searchParams.get('brand');

  if (brand) {
    const { data: products, error } = await supabase
      .from('product_with_details')
      .select('*')
      .limit(10)
      .eq('brand', brand);

    if (error) {
      console.error('error', error.message);
      return NextResponse.json({ error }, { status: 500 });
    }

    const response = products.map(({ product_id, ...product }) => ({
      productId: product_id,
      ...product,
    }));

    return NextResponse.json(response);
  }

  const page = Number(searchParams.get('page') ?? '1');
  const limit = 30;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: products, error } = await supabase
    .from('product_with_details')
    .select('*')
    .range(from, to)
    .order('product_id', { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  const response = products.map(({ product_id, ...product }) => ({
    productId: product_id,
    ...product,
  }));

  return NextResponse.json(response);
}
