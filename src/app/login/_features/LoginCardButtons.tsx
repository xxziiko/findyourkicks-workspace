'use client';

import { Button } from '@/components';
import { GoogleLogo, KakaoLogo } from '@/components/icons';
import useLoginCardButtons from './useLoginCardButtons';

export default function LoginCardButtons() {
  const { handleLoginWithKakao, handleLoginWithGoogle } = useLoginCardButtons();

  return (
    <>
      <Button
        icon={<KakaoLogo />}
        onClick={handleLoginWithKakao}
        text="카카오계정으로 로그인"
        variant="kakao"
      />
      <Button
        onClick={handleLoginWithGoogle}
        icon={<GoogleLogo />}
        text="구글계정으로 로그인"
        variant="google"
      />
    </>
  );
}
