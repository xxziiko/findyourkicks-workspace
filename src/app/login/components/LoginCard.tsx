'use client';

import { Button } from '@/components';
import useLoginCard from '../hooks/useLoginCard';
import { GoogleLogo } from '../icons/GoogleLogo';
import { KakaoLogo } from '../icons/KakaoLogo';
import styles from './LoginCard.module.scss';

export default function LoginCard() {
  const { handleLoginWithKakao, handleLoginWithGoogle } = useLoginCard();

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
