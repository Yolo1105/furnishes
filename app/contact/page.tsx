import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ui/ComingSoon';

export const metadata: Metadata = {
  title: 'Contact | Furnishes',
  description: 'Get in touch with the Furnishes team.',
};

export default function ContactPage() {
  return (
    <ComingSoon
      title="Contact"
      description="Contact form and details are on the way. For now, reach us at hello@furnish.es."
    />
  );
}
