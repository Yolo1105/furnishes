'use client';

import React from 'react';
import PageHero from '@/components/shared/ui/PageHero';
import { PlaygroundProvider } from '@/contexts/PlaygroundContext';
import PlaygroundLayout from '@/components/pages/playground/sections/PlaygroundLayout';
import { smoothScrollTo } from '@/utils/scrollAnimation';
import styles from './PlaygroundPage.module.css';

export default function PlaygroundPage() {
  const scrollToPlayground = () => {
    smoothScrollTo('playground-section');
  };

  return (
    <PlaygroundProvider>
      <div className={styles.playgroundPage}>
        {/* Hero Banner Cover */}
        <div className={styles.heroWrapper}>
          <PageHero
            imageSrc="/images/hero-modern-room.jpg"
            imageAlt="Playground hero image"
            titleLines={['Design', 'Your', 'Perfect Space']}
            description="Experiment with layouts, furniture arrangements, and room configurations. Test ideas freely before committing to your final design plan."
          />
          {/* Scroll to Playground Button */}
          <button 
            className={styles.scrollToPlaygroundButton}
            onClick={scrollToPlayground}
            aria-label="Scroll to playground section"
            title="Scroll to playground"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <section id="playground-section" className={styles.section}>
          <PlaygroundLayout />
        </section>
      </div>
    </PlaygroundProvider>
  );
}
