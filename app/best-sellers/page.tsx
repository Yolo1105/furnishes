import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Best Sellers | Furnishes',
  description: 'Explore our most popular furniture and home pieces.',
};

export default function BestSellersPage() {
  return <ComingSoon title="Best Sellers" description="Our top picks are coming soon. Check back." />;
}
