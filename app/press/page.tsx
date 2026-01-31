import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Press | Furnishes',
  description: 'Press releases, media kit, and brand assets.',
};

export default function PressPage() {
  return <ComingSoon title="Press" description="Press and media resources are coming soon." />;
}
