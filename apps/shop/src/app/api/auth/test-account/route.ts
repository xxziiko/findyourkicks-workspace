import { createClient } from '@/shared/utils/supabase/server';
import { assert } from '@findyourkicks/shared';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@test.com',
    password: process.env.TEST_ACCOUNT_PW,
  });

  assert(!error, error?.message ?? '테스트 계정 로그인 실패');

  return NextResponse.json(data);
}
