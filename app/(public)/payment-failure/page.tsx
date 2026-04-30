import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import PaymentFailureClient from './PaymentFailureClient';

export const metadata: Metadata = buildMetadata({
  title:   'Payment Failure | Vastu Arya',
  path:    '/payment-failure',
  noIndex: true,
});

export default function Page() {
  return <PaymentFailureClient />;
}
