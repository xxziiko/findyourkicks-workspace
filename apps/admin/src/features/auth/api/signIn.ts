import { supabase } from '@/shared';
import { assert } from '@findyourkicks/shared';
import { z } from 'zod';

const userSchema = z.object({
  email: z
    .string({ required_error: '이메일을 입력해주세요.' })
    .email('유효한 이메일 형식이 아닙니다.'),
  password: z
    .string({ required_error: '비밀번호를 입력해주세요.' })
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type User = z.infer<typeof userSchema>;

const signIn = async (data: User) => {
  const { email, password } = data;
  const { data: user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  assert(error === null, '로그인에 실패했습니다.');
  return user;
};

export { signIn, userSchema, type User };
