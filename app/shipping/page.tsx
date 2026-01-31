import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Shipping & Delivery | Furnishes',
  description: 'Shipping options, delivery times, and tracking.',
};

export default function ShippingPage() {
  return <ComingSoon title="Shipping & Delivery" description="Shipping and delivery information is coming soon." />;
}
