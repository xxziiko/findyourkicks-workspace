import { createClient } from '@/shared/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next') ?? '/';
  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo,
      queryParams: {
        next: encodeURIComponent(next),
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data.url, { status: 200 });
}
