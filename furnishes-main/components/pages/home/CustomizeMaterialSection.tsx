'use client';

import React from 'react';
import Image from 'next/image';
import { commonStyles } from '@/components/shared/styles/commonStyles';
import { CSSProperties } from 'react';
import { IMAGES } from '@/constants/images';

const styles = {
  materialCard: {
    background: 'transparent',
    borderRadius: '0',
    boxShadow: 'none',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,
  materialCardImage: {
    width: '100%',
    height: '280px',
    objectFit: 'cover',
    display: 'block',
  } as CSSProperties,
  materialCardContent: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  } as CSSProperties,
  materialCardTitle: {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: '#111',
    fontFamily: 'var(--font-manrope), sans-serif',
    margin: 0,
  } as CSSProperties,
  materialCardDescription: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#666',
    fontFamily: 'var(--font-manrope), sans-serif',
    margin: 0,
  } as CSSProperties,
};

export default function CustomizeMaterialSection() {
  return (
    <section id="grid" className="relative z-10 flex min-h-screen flex-col items-center justify-center p-24" style={{ backgroundColor: '#FFFEF8', position: 'relative', overflow: 'visible', borderTop: '1px solid rgba(229, 94, 0, 0.15)' }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 3 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={commonStyles.topLabel}>
            <div style={commonStyles.topLabelLine} />
            <span style={commonStyles.topLabelText}>Trustworthy Brand for You</span>
            <div style={commonStyles.topLabelLine} />
          </div>
          
          <h2 style={{ ...commonStyles.headingLarge, marginBottom: '1.5rem' }}>
            Customize Your Material
          </h2>
          <p style={{ ...commonStyles.bodyText, maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            Discover our curated selection of premium materials, each offering unique, award-winning fabrics and designs.
          </p>
        </div>

        {/* Three Material Cards */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap', width: '100%' }}>
          {/* Card 1 - Premium Textures */}
          <div style={{ ...styles.materialCard, flex: '0 1 320px', minWidth: 280, maxWidth: 360, background: '#ffffff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Image
              src={IMAGES.HERO_MODERN_ROOM}
              alt="Premium textures interior"
              width={360}
              height={280}
              style={styles.materialCardImage}
            />
            <div style={styles.materialCardContent}>
              <h3 style={styles.materialCardTitle}>Premium Textures</h3>
              <p style={styles.materialCardDescription}>
                Elevated weaves and finishes that add depth, warmth, and a touch of luxury to your space.
              </p>
            </div>
          </div>

          {/* Card 2 - Everyday Essentials */}
          <div style={{ ...styles.materialCard, flex: '0 1 320px', minWidth: 280, maxWidth: 360, background: '#ffffff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Image
              src={IMAGES.HERO_MODERN_ROOM}
              alt="Everyday essentials materials"
              width={360}
              height={280}
              style={styles.materialCardImage}
            />
            <div style={styles.materialCardContent}>
              <h3 style={styles.materialCardTitle}>Everyday Essentials</h3>
              <p style={styles.materialCardDescription}>
                Soft, durable fabrics perfect for daily use—easy to clean and made for comfort.
              </p>
            </div>
          </div>

          {/* Card 3 - Performance Fabrics */}
          <div style={{ ...styles.materialCard, flex: '0 1 320px', minWidth: 280, maxWidth: 360, background: '#ffffff', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Image
              src={IMAGES.HERO_MODERN_ROOM}
              alt="Performance fabrics interior"
              width={360}
              height={280}
              style={styles.materialCardImage}
            />
            <div style={styles.materialCardContent}>
              <h3 style={styles.materialCardTitle}>Performance Fabrics</h3>
              <p style={styles.materialCardDescription}>
                Engineered for life&apos;s messes—stain-resistant, pet-friendly, and built to last.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
