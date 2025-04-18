'use client';

import { CheckoutSteps } from '@/shared/components';
import { PATH } from '@/shared/constants/path';
import { usePathname } from 'next/navigation';

const steps = [PATH.cart, PATH.checkout, PATH.complete] as const;

export default function CheckoutLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => pathname.startsWith(step));

  return (
    <div>
      {currentStep !== -1 && <CheckoutSteps currentStep={currentStep} />}
      {children}
    </div>
  );
}
