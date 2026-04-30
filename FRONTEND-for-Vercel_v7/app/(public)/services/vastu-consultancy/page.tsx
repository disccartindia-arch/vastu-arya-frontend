import type { Metadata } from 'next';
import { buildMetadata } from '../../../../../lib/seo';
import VastuConsultancyClient from './VastuConsultancyClient';

export const metadata: Metadata = buildMetadata({
  title:       'Vastu Shastra Consultancy – Online & In-Person | Dr. PPS Tomar',
  description: 'Get a personalised Vastu Shastra consultation from IVAF Certified Expert Dr. PPS Tomar. Online sessions across India. Remedies without demolition. From ₹11.',
  path:        '/services/vastu-consultancy',
});

export default function Page() {
  return <VastuConsultancyClient />;
}
