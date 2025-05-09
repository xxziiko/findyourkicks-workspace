import { CheckoutSteps } from '@/shared/components/layouts';

export default function CheckoutLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <CheckoutSteps />
      {children}
    </div>
  );
}
