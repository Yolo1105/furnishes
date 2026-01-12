import SectionMenu from '@/components/shared/ui/SectionMenu';
import LandingHeroSection from '@/components/shared/layout/LandingHeroSection';
import StatisticsSection from '@/components/shared/layout/StatisticsSection';
import InfoSection from '@/components/pages/home/InfoSection';
import DesignYourSpaceSection from '@/components/pages/home/DesignYourSpaceSection';
import CustomizeMaterialSection from '@/components/pages/home/CustomizeMaterialSection';
import HeritageSection from '@/components/pages/home/HeritageSection';

export default function Home() {
  return (
    <>
      <SectionMenu
        items={[
          { id: 'home', label: 'Home' },
          { id: 'info', label: 'About' },
          { id: 'sofa', label: 'Design' },
          { id: 'grid', label: 'Materials' },
          { id: 'heritage', label: 'Heritage' },
        ]}
      />
      <main className="relative w-full">
        {/* Hero Section with circle animations and Take a seat CTA */}
        <LandingHeroSection />
        
        {/* Statistics Section */}
        <StatisticsSection />
        
        {/* Info Section */}
        <InfoSection />
        
        {/* Design Your Space Section */}
        <DesignYourSpaceSection />
        
        {/* Customize Material Section */}
        <CustomizeMaterialSection />
        
        {/* Heritage Section */}
        <HeritageSection />
      </main>
    </>
  );
}
