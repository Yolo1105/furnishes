import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Sustainability | Furnishes',
  description: 'Our commitment to sustainable design and responsible sourcing.',
};

export default function SustainabilityPage() {
  return <ComingSoon title="Sustainability" description="Our sustainability story is coming soon." />;
}
