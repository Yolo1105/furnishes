import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'New Arrivals | Furnishes',
  description: 'Discover our latest furniture and home collections.',
};

export default function NewArrivalsPage() {
  return <ComingSoon title="New Arrivals" description="Our newest pieces are on the way. Check back soon." />;
}
