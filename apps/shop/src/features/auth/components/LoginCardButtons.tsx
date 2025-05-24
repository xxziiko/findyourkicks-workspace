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
        variant="kakao"
        data-testid="kakao-btn"
      >
        카카오계정으로 로그인
      </Button>
      <Button
        onClick={async () => router.push(await signInWithGoogle())}
        icon={<GoogleLogo />}
        variant="google"
        data-testid="google-btn"
      >
        구글계정으로 로그인
      </Button>
    </>
  );
}
