import { ChevronsRight } from 'lucide-react';
import styles from './CheckoutSteps.module.scss';

enum CurrentStep {
  Cart = 0,
  Checkout = 1,
  Complete = 2,
}

const STEP = ['장바구니', '주문/결제', '주문완료'] as const;

export default function CheckoutSteps({
  currentStep,
}: { currentStep: CurrentStep }) {
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
