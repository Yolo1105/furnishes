import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Furnishes',
  description: 'Return and exchange policy and how to start a return.',
};

export default function ReturnsPage() {
  return <ComingSoon title="Returns & Exchanges" description="Our returns and exchange policy will be here soon." />;
}
