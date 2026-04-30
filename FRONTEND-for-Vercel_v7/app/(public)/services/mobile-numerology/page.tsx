import type { Metadata } from 'next';
import { buildMetadata } from '../../../../../lib/seo';
import MobileNumerologyClient from './MobileNumerologyClient';

export const metadata: Metadata = buildMetadata({
  title:       'Mobile Numerology – Lucky Mobile Number Analysis | Dr. PPS Tomar',
  description: 'Is your mobile number lucky for you? Get a personalised Mobile Numerology analysis by Dr. PPS Tomar. Change your number, change your fortune. Book online.',
  path:        '/services/mobile-numerology',
});

export default function Page() {
  return <MobileNumerologyClient />;
}
