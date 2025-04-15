'use client';

import { CheckoutSteps } from '@/shared/components';
import { usePathname } from 'next/navigation';

const steps = ['/cart', '/checkout', '/complete'];

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
