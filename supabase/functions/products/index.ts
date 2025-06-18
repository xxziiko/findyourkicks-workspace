import { createClient } from 'npm:@supabase/supabase-js';
import { withApiHandler } from '../_shared/withApiHandler.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

Deno.serve(async (req: Request) => {
  return withApiHandler(req, async (req) => {
    if (req.method === 'GET') {
      return withApiHandler(
        req,
        async (req) =>
          await supabase.rpc('get_filtered_products', {
            p_search: search,
            p_status: status,
            p_category: category,
            p_brand: brand,
            p_start_date: new Date(period?.startDate ?? '2025-01-01'),
            p_end_date: new Date(period?.endDate ?? new Date()),
            p_page: page ?? 1,
            p_page_size: 30,
          }),
      );
    }

    if (req.method === 'POST') {
      return withApiHandler(
        req,
        async (req) =>
          await supabase.rpc('insert_product_with_inventory', {
            _brand: brand,
            _category: category,
            _title: productName,
            _price: price,
            _description: description,
            _images: images,
            _sizes: sizes,
            _status: status,
          }),
      );
    }
  });
});
