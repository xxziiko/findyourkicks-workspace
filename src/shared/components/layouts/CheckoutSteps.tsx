'use client';

import { PATH } from '@/shared/constants/path';
import { ChevronsRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import styles from './CheckoutSteps.module.scss';

const STEP_PATHS = [PATH.cart, PATH.checkout, PATH.complete] as const;
const STEP = ['장바구니', '주문/결제', '주문완료'] as const;

export default function CheckoutSteps() {
  const pathname = usePathname();
  const currentStep = STEP_PATHS.findIndex((step) => pathname.startsWith(step));

  return (
    <div className={styles.title}>
      <h1 className={styles.title__head}>{STEP[currentStep]}</h1>

      <div className={styles.title__step}>
        {STEP.map((step, index) => (
          <div
            key={step}
            className={`${styles.title__step} ${
              index === currentStep && styles['title__step--active']
            }`}
          >
            <p>{step}</p>
            {index < STEP.length - 1 && <ChevronsRight />}
          </div>
        ))}
      </div>
    </div>
  );
}
