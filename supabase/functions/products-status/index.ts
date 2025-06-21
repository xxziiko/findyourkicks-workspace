import { createClient } from 'npm:@supabase/supabase-js';
import { withApiHandler } from '../_shared/withApiHandler.ts';

interface ProductStatus {
  all: number;
  pending: number;
  selling: number;
  soldout: number;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

Deno.serve(async (req: Request) => {
  return withApiHandler(
    req,
    async (req) => await supabase.rpc('get_all_products_status'),
  );
});
