'use client';

import React from 'react';
import Image from 'next/image';
import { commonStyles } from '@/components/shared/styles/commonStyles';
import { CSSProperties } from 'react';
import { IMAGES } from '@/constants/images';

const styles = {
  heritageCard: {
    background: '#2C2C2C',
    borderRadius: '0',
    overflow: 'hidden',
    display: 'flex',
    width: '100%',
    maxWidth: '1100px',
    minHeight: '500px',
    margin: '0 auto',
  } as CSSProperties,
  heritageColumn: {
    flex: '1 1 33.333%',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,
  heritageImageColumn: {
    flex: '1 1 33.333%',
    position: 'relative',
    overflow: 'hidden',
  } as CSSProperties,
  heritageTextColumn: {
    flex: '1 1 33.333%',
    background: '#ffeddf',
    padding: '3rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  } as CSSProperties,
  heritageYearHeading: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#111',
    fontFamily: 'var(--font-manrope), sans-serif',
    textAlign: 'center',
    marginBottom: '1.5rem',
  } as CSSProperties,
  heritageBodyText: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: '#333',
    fontFamily: 'var(--font-manrope), sans-serif',
    marginBottom: '2rem',
  } as CSSProperties,
  heritageButton: {
    background: 'transparent',
    border: '2px solid #FF7A1A',
    color: '#FF7A1A',
    padding: '0.9rem 2rem',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: 'var(--font-manrope), sans-serif',
    cursor: 'pointer',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    width: '100%',
  } as CSSProperties,
};

export default function HeritageSection() {
  return (
    <section id="heritage" className="relative z-10 flex min-h-screen flex-col items-center justify-center p-24" style={{ backgroundColor: '#FFFEF8', position: 'relative', overflow: 'visible', borderTop: '1px solid rgba(229, 94, 0, 0.15)' }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 3 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={commonStyles.topLabel}>
            <div style={commonStyles.topLabelLine} />
            <span style={commonStyles.topLabelText}>Personalized Crafts for You</span>
            <div style={commonStyles.topLabelLine} />
          </div>
          
          <h2 style={{ ...commonStyles.headingLarge, marginBottom: '1.5rem' }}>
            Celebrate Your Heritage
          </h2>
          <p style={{ ...commonStyles.bodyText, maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            Experience our legacy of crafts and passion for quality, blending tradition with modern innovation.
          </p>
        </div>

        {/* Three-Column Heritage Card */}
        <div style={{ ...styles.heritageCard, margin: '0 auto' }}>
          {/* Left Column - Image */}
          <div style={styles.heritageImageColumn}>
            <Image
              src={IMAGES.HERO_MODERN_ROOM}
              alt="Craftsmanship in action"
              width={367}
              height={500}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Middle Column - Text Content */}
          <div style={{ ...styles.heritageTextColumn, background: '#ffffff' }}>
            <div>
              <h3 style={styles.heritageYearHeading}>SINCE 2025s</h3>
              <p style={styles.heritageBodyText}>
                Furnishes is a Singapore-based direct-to-consumer furniture platform (SIC 47531) combining AI-powered interior planning with integrated manufacturing and logistics. Customers input their room dimensions, style preferences, and budget to receive a photorealistic 3D layout in minutes. Each modular piece is made-to-order, quality-checked, and delivered with white-glove service—offering a seamless, personalized furnishing experience with unmatched speed, accuracy, and efficiency.
              </p>
            </div>
            <button style={styles.heritageButton}>
              FIND OUT MORE
            </button>
          </div>

          {/* Right Column - Image */}
          <div style={styles.heritageImageColumn}>
            <Image
              src={IMAGES.HERO_MODERN_ROOM}
              alt="Craft materials and tools"
              width={367}
              height={500}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
