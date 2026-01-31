'use client';

import React from 'react';
import PageHero from '@/components/shared/ui/PageHero';
import styles from './ValidatePage.module.css';

export default function ValidatePage() {
  return (
    <div className={styles.validatePage}>
      {/* Hero Banner Cover */}
      <PageHero
        imageSrc="/images/hero-modern-room.jpg"
        imageAlt="Validate hero image"
        title="Validation ready for your design"
        description="Pass/Amber checks for lanes, collisions, ergonomics, and delivery route."
      />

      {/* Main Content */}
      <section className={styles.section}>
        <div className={styles.contentLayer}>
          <div className={styles.placeholder}>
            <h2>Validate Content</h2>
            <p>This is where your validation content will go.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
