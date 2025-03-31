'use client';

import { CheckoutSteps } from '@/components';
import { usePathname } from 'next/navigation';

const steps = ['/cart', '/checkout', '/complete'];

export default function CheckoutLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = steps.indexOf(pathname);

  return (
    <div>
      {currentStep !== -1 && <CheckoutSteps currentStep={currentStep} />}
      {children}
    </div>
  );
}
