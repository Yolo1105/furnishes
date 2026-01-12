'use client';

import React from 'react';
import styles from './AboutPage.module.css';

// Import sections
import HeroSection from '@/components/pages/about/sections/HeroSection';
import AboutFurnishesSection from '@/components/pages/about/sections/AboutFurnishesSection';
import MissionSection from '@/components/pages/about/sections/MissionSection';
import TeamSection from '@/components/pages/about/sections/TeamSection';
import TestimonialsSection from '@/components/pages/about/sections/TestimonialsSection';
import SectionMenu from '@/components/shared/ui/SectionMenu';
import PageHero from '@/components/shared/ui/PageHero';

export default function About() {
  return (
    <div className={styles.aboutPage}>
      <SectionMenu
        items={[
          { id: 'step-0', label: 'About Us' },
          { id: 'hero-section', label: 'AI Assistant' },
          { id: 'about-section', label: 'About Furnishes' },
          { id: 'mission-section', label: 'Our Mission' },
          { id: 'team-section', label: 'Our Team' },
          { id: 'testimonials-section', label: 'Testimonials' },
        ]}
        shouldAnimate={false}
        initialInHero={false}
      />
      {/* Hero Banner Cover */}
      <PageHero 
        imageSrc="/images/hero-modern-room.jpg"
        imageAlt="About Us hero image"
        titleLines={['Discover', 'About', 'Furnishes']}
        description="Your AI-powered interior design companion for creating beautiful spaces. Learn how we're transforming the way you design your home."
      />

      {/* Hero Section */}
      <section className={`${styles.section} ${styles.sectionPeach}`} id="hero-section">
        <div className={styles.contentLayer}>
          <HeroSection />
        </div>
      </section>

      {/* About Section */}
      <section className={`${styles.section} ${styles.sectionCream}`} id="about-section">
        <div className={styles.contentLayer}>
          <AboutFurnishesSection />
        </div>
      </section>

      {/* Mission Section */}
      <section className={`${styles.section} ${styles.sectionPeach}`} id="mission-section">
        <div className={styles.contentLayer}>
          <MissionSection />
        </div>
      </section>

      {/* Team Section */}
      <section className={`${styles.section} ${styles.sectionCream}`} id="team-section">
        <div className={styles.contentLayer}>
          <TeamSection />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`${styles.section} ${styles.sectionPeach}`} id="testimonials-section">
        <div className={styles.contentLayer}>
          <TestimonialsSection />
        </div>
      </section>
    </div>
  );
}
