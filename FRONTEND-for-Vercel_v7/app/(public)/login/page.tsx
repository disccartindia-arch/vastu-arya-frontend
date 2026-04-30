import type { Metadata } from 'next';
import { buildMetadata } from '../../../../lib/seo';
import LoginClient from './LoginClient';

export const metadata: Metadata = buildMetadata({
  title:  'Login | Vastu Arya',
  description: 'Sign in to your Vastu Arya account.',
  path:   '/login',
  noIndex: true,
});

export default function Page() {
  return <LoginClient />;
}
