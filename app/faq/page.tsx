import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'FAQ | Furnishes',
  description: 'Frequently asked questions about orders, shipping, and returns.',
};

export default function FAQPage() {
  return <ComingSoon title="FAQ" description="Answers to common questions are on the way. Check back soon." />;
}
