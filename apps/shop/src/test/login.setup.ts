import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { test as base } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

type AuthFixtures = {
  authContext: BrowserContext;
};

export const test = base.extend<AuthFixtures>({
  authContext: async ({ browser }, use) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'fake_password',
      email_confirm: true,
      user_metadata: { provider: 'google' },
    });

    const { data: session } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'fake_password',
    });

    if (!session.session) {
      throw new Error('세션 생성 실패');
    }

    const authContext = await browser.newContext({
      storageState: {
        cookies: [
          {
            name: 'sb-access-token',
            value: session.session.access_token,
            domain: 'localhost',
            path: '/',
            expires: Date.now() / 1000 + 60 * 60, // 1시간
            httpOnly: true,
            secure: false,
            sameSite: 'Lax', // 다른 도메인에서 요청이 들어올때 쿠키를 포함할지 말지 제어(기본값)
          },
          {
            name: 'sb-refresh-token',
            value: session.session.refresh_token,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            expires: Date.now() / 1000 + 60 * 60,
          },
        ],
        origins: [],
      },
    });

    const page = await authContext.newPage();
    await page.goto('http://localhost:3000');

    await authContext.storageState({ path: 'storageState.json' });
    await use(authContext);
  },
});
