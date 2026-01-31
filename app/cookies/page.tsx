import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Cookie Policy | Furnishes',
  description: 'How Furnishes uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return <ComingSoon title="Cookie Policy" description="Our cookie policy is coming soon." />;
}
