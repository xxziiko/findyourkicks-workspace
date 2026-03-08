import { createClient } from 'npm:@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';
import { withApiHandler } from '../_shared/withApiHandler.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

async function getReturns(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  let query = supabase
    .from('order_returns')
    .select(`
      return_id,
      order_id,
      return_type,
      reason,
      details,
      status,
      created_at:requested_at,
      orders(
        order_id,
        status,
        total_amount,
        order_date,
        user_id,
        order_items(
          product_id,
          size,
          quantity,
          price,
          products(title)
        )
      )
    `)
    .order('requested_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  return query;
}

async function approveReturn(returnId: string) {
  return supabase.rpc('approve_return_request', { p_return_id: returnId });
}

async function rejectReturn(returnId: string) {
  return supabase
    .from('order_returns')
    .update({ status: 'rejected' })
    .eq('return_id', returnId);
}

Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  // path after /admin/returns: e.g. '' or '/:returnId/approve'
  const pathMatch = url.pathname.match(/\/admin\/returns\/?(.*)$/);
  const subPath = pathMatch ? pathMatch[1] : '';

  return withApiHandler(req, async (req) => {
    if (req.method === 'GET' && !subPath) {
      return getReturns(req);
    }

    if (req.method === 'POST') {
      const parts = subPath.split('/').filter(Boolean);
      // parts[0] = returnId, parts[1] = 'approve' | 'reject'
      if (parts.length === 2) {
        const [returnId, action] = parts;
        if (action === 'approve') return approveReturn(returnId);
        if (action === 'reject') return rejectReturn(returnId);
      }
    }

    return new Response('Not Found', { status: 404 });
  });
});
