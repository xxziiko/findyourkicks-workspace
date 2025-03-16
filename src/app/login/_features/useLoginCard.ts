'use client';
import { signInWithGoogle, signInWithKakao } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function useLoginCard() {
  const router = useRouter();

  const handleLoginWithKakao = async () => {
    const { url } = await signInWithKakao();

    router.push(url);
  };

  const handleLoginWithGoogle = async () => {
    const { url } = await signInWithGoogle();

    router.push(url);
  };

  return {
    handleLoginWithGoogle,
    handleLoginWithKakao,
  };
}
