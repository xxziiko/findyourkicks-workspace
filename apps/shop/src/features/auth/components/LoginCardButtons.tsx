'use client';

import { signInWithGoogle, signInWithKakao } from '@/features/auth';
import { GoogleLogo, KakaoLogo } from '@/shared/components/icons';
import { Button } from '@findyourkicks/shared';
import { useRouter } from 'next/navigation';

export function LoginCardButtons() {
  const router = useRouter();

  return (
    <>
      <Button
        icon={<KakaoLogo />}
        onClick={async () => router.push(await signInWithKakao())}
        text="카카오계정으로 로그인"
        variant="kakao"
        data-testid="kakao-btn"
      />
      <Button
        onClick={async () => router.push(await signInWithGoogle())}
        icon={<GoogleLogo />}
        text="구글계정으로 로그인"
        variant="google"
        data-testid="google-btn"
      />
    </>
  );
}
