import { createClient } from 'npm:@supabase/supabase-js';
import { withApiHandler } from '../_shared/withApiHandler.ts';

interface Brand {
  brand_id: string;
  name: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

Deno.serve(async (req: Request) => {
  return withApiHandler(
    req,
    async (req) => await supabase.from('brands').select('*'),
  );
});
