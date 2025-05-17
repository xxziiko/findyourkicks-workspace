import { supabase } from '@/shared/utils';
import { assert } from '@findyourkicks/shared';

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  assert(error === null, '로그아웃에 실패했습니다.');
};
