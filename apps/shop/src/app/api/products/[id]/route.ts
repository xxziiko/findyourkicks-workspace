import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

type RawProduct = {
  product_id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  brand: { name: string };
  category: { name: string };
  inventory: { size: string; stock: number }[];
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      product_id,
      title,
      price,
      image,
      description,
      brand:brands!fk_product_brand (name),
      category:categories!fk_product_category(name),
      inventory:inventory(
        size,
        stock
      )
    `)
    .eq('product_id', id)
    .single<RawProduct>();

  if (error) return NextResponse.json({ error }, { status: 500 });

  const { data: ratingSummary } = await supabase
    .from('product_rating_summary')
    .select('*')
    .eq('product_id', id)
    .maybeSingle();

  const flatProduct = {
    productId: product.product_id,
    title: product.title,
    price: product.price,
    image: product.image,
    description: product.description,
    brand: product.brand?.name ?? null,
    category: product.category?.name ?? null,
    inventory: product.inventory ?? [],
    rating: {
      average: ratingSummary?.average_rating
        ? Number(ratingSummary.average_rating)
        : 0,
      count: ratingSummary?.review_count ?? 0,
      distribution: {
        1: ratingSummary?.rating_1 ?? 0,
        2: ratingSummary?.rating_2 ?? 0,
        3: ratingSummary?.rating_3 ?? 0,
        4: ratingSummary?.rating_4 ?? 0,
        5: ratingSummary?.rating_5 ?? 0,
      },
    },
  };

  return NextResponse.json(flatProduct);
}
