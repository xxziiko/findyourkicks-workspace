import type { Detail } from '@/app/product/[id]/_features/Detail';
import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

type SupabaseProduct = {
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
    .single<SupabaseProduct>();

  if (error) return NextResponse.json({ error }, { status: 500 });

  const flatProduct: Detail = {
    productId: product.product_id,
    title: product.title,
    price: product.price,
    image: product.image,
    description: product.description,
    brand: product.brand?.name ?? '',
    category: product.category?.name ?? '',
    inventory: product.inventory ?? [],
  };

  return NextResponse.json(flatProduct);
}
