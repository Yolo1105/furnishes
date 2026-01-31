import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Privacy Policy | Furnishes',
  description: 'How Furnishes collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return <ComingSoon title="Privacy Policy" description="Our privacy policy is being updated. Check back soon." />;
}
