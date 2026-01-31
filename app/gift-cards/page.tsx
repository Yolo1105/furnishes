import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Gift Cards | Furnishes',
  description: 'Give the gift of design with Furnishes gift cards.',
};

export default function GiftCardsPage() {
  return <ComingSoon title="Gift Cards" description="Gift cards will be available soon. Check back." />;
}
