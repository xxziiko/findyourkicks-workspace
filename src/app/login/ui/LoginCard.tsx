'use client';

import { signInWithGoogle, signInWithKakao } from '@/app/lib/api';
import styles from '@/app/login/ui/LoginCard.module.scss';
import { Button } from '@/components';
import { useRouter } from 'next/navigation';
import { GoogleLogo } from '../icons/GoogleLogo';
import { KakaoLogo } from '../icons/KakaoLogo';

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
    <div className={styles.card_layout}>
      <h3 className={styles.card_title}>
        🚀 3초 만에, <br /> 간편하게 시작해요!
      </h3>
      <div className={styles.btn_box}>
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
      </div>
    </div>
  );
}
