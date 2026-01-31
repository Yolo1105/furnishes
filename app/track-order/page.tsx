import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Track Order | Furnishes',
  description: 'Track your Furnishes order delivery status.',
};

export default function TrackOrderPage() {
  return <ComingSoon title="Track Order" description="Order tracking will be available here soon." />;
}
