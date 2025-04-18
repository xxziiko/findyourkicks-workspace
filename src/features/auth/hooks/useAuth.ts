import { createClient } from '@/shared/utils/supabase/server';

export async function useAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { isLoggedIn: !!user?.id, user };
}
