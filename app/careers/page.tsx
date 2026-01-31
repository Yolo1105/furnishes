import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Careers | Furnishes',
  description: 'Join the Furnishes team. Explore open roles and our culture.',
};

export default function CareersPage() {
  return <ComingSoon title="Careers" description="We're hiring. Career opportunities will be listed here soon." />;
}
