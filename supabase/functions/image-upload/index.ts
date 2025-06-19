import { createClient } from 'npm:@supabase/supabase-js';
import { withApiHandler } from '../_shared/withApiHandler.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const BUCKET_NAME = 'products';

Deno.serve(async (req: Request) => {
  return withApiHandler(req, async (req) => {
    const url = new URL(req.url);
    const params = url.searchParams;

    const filePath = params.get('filePath') ?? '';
    const webpFile = params.get('webpFile') ?? '';

    await supabase.storage.from(BUCKET_NAME).upload(filePath, webpFile, {
      upsert: true,
    });

    return {
      urls: [
        `${supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath).data.publicUrl}`,
      ],
    };
  });
});
