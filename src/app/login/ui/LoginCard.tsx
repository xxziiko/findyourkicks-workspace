'use client';

import { signInWithGoogle, signInWithKakao } from '@/app/lib/api';
import { Button } from '@headlessui/react';
import { useRouter } from 'next/navigation';

export default function LoginCard() {
  const router = useRouter();

  const handleLoginWithKakao = async () => {
    const { url } = await signInWithKakao();

    router.push(url);
  };

  const handleLoginWithGoogle = async () => {
    const { url } = await signInWithGoogle();

    router.push(url);
  };

  return (
    <>
      <Button onClick={handleLoginWithKakao}>카카오 로그인</Button>
      <Button onClick={handleLoginWithGoogle}>구글 로그인</Button>
    </>
  );
}
