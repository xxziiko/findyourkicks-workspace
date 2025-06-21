import { createClient } from 'npm:@supabase/supabase-js';
import { withApiHandler } from '../_shared/withApiHandler.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

Deno.serve(async (req: Request) => {
  return withApiHandler(
    req,
    async (req) =>
      await supabase
        .from('products')
        .select('product_id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
  );
});
