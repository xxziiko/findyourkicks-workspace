import { createClient } from 'npm:@supabase/supabase-js';
import { withApiHandler } from '../_shared/withApiHandler.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

async function get(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const params = url.searchParams;

  const search = params.get('search') ?? '';
  const status = params.get('status') ?? '';
  const category = params.get('category') ?? '';
  const brand = params.get('brand') ?? '';
  const page = Number(params.get('page') ?? '1');
  const startDate = new Date(params.get('startDate') ?? '2025-01-01');
  const endDate = new Date(params.get('endDate') ?? new Date().toISOString());

  return await supabase.rpc('get_filtered_products', {
    p_search: search,
    p_status: status,
    p_category: category,
    p_brand: brand,
    p_start_date: startDate,
    p_end_date: endDate,
    p_page: page,
    p_page_size: 30,
  });
}

async function post(req: Request): Promise<Response> {
  const body = await req.json();

  const {
    brand,
    category,
    productName,
    price,
    description,
    images,
    sizes,
    status,
  } = body;

  return await supabase.rpc('insert_product_with_inventory', {
    _brand: brand,
    _category: category,
    _title: productName,
    _price: price,
    _description: description,
    _images: images,
    _sizes: sizes,
    _status: status,
  });
}

Deno.serve((req: Request) => {
  return withApiHandler(req, async (req) => {
    if (req.method === 'GET') return get(req);
    if (req.method === 'POST') return post(req);
    return new Response('Method Not Allowed', { status: 405 });
  });
});
