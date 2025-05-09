'use server';

import { cookies } from 'next/headers';

export async function getCookieString() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}
