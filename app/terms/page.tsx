import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Terms of Service | Furnishes',
  description: 'Terms of service for using Furnishes.',
};

export default function TermsPage() {
  return <ComingSoon title="Terms of Service" description="Terms of service will be available here soon." />;
}
