'use client';

import { Button } from '@/components';
import { GoogleLogo, KakaoLogo } from '@/components/icons';
import { signInWithGoogle, signInWithKakao } from '@/features/auth/apis';
import { useRouter } from 'next/navigation';

export function LoginCardButtons() {
  const router = useRouter();

  return (
    <>
      <Button
        icon={<KakaoLogo />}
        onClick={async () => {
          router.push(await signInWithKakao());
        }}
        text="카카오계정으로 로그인"
        variant="kakao"
      />
      <Button
        onClick={async () => {
          router.push(await signInWithGoogle());
        }}
        icon={<GoogleLogo />}
        text="구글계정으로 로그인"
        variant="google"
      />
    </>
  );
}
