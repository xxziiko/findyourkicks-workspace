'use client';
import { ErrorFallback } from '@findyourkicks/shared';

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}) {
  return <ErrorFallback reset={reset} />;
}
