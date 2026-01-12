'use client';

import React from 'react';
import Image from 'next/image';
import { commonStyles } from '@/components/shared/styles/commonStyles';
import { CSSProperties } from 'react';
import { IMAGES } from '@/constants/images';

const styles = {
  infoCard: {
    background: 'transparent',
    borderRadius: '1.2rem',
    boxShadow: 'none',
    padding: '1.8rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as CSSProperties,
  cardIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FF7A1A',
  } as CSSProperties,
  cardTitle: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#111',
    fontFamily: 'var(--font-manrope), sans-serif',
    margin: 0,
  } as CSSProperties,
  cardDescription: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#333',
    fontFamily: 'var(--font-manrope), sans-serif',
    margin: 0,
  } as CSSProperties,
};

export default function DesignYourSpaceSection() {
  return (
    <section id="sofa" className="relative z-10 flex min-h-screen flex-col items-center justify-center p-24" style={{ backgroundColor: '#FFFEF8', position: 'relative', overflow: 'visible', borderTop: '1px solid rgba(229, 94, 0, 0.15)' }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 3 }}>
        {/* Centered Heading */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={commonStyles.topLabel}>
            <div style={commonStyles.topLabelLine} />
            <span style={commonStyles.topLabelText}>Interior Design for You</span>
            <div style={commonStyles.topLabelLine} />
          </div>
          
          <h2 style={{ ...commonStyles.headingLarge, marginBottom: '1.5rem' }}>
            Design Your Space
          </h2>
          <p style={{ ...commonStyles.bodyText, maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            At Furnishes, we empower you to design furniture that fits your style, space, and budget—seamlessly and sustainably.
          </p>
        </div>

        {/* Cards and Image Layout */}
        <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', width: '100%' }}>
          {/* Left Column - Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '0 1 280px', minWidth: 260 }}>
            {/* Card 1 */}
            <div style={{ ...styles.infoCard, flex: 1, background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div style={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M3 9h18M9 3v18" />
                </svg>
              </div>
              <h3 style={styles.cardTitle}>Modular Personalization</h3>
              <p style={styles.cardDescription}>
                Design each piece to your exact needs and preferences, creating furniture that truly fits your space and lifestyle.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ ...styles.infoCard, flex: 1, background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div style={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 style={styles.cardTitle}>Made-to-Order, Not Mass-Produced</h3>
              <p style={styles.cardDescription}>
                Every piece is crafted specifically for you, ensuring quality and uniqueness that mass production cannot match.
              </p>
            </div>
          </div>

          {/* Central Image */}
          <div style={{ flex: '0 1 400px', minWidth: 350, maxWidth: 500, display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
            <Image
              src={IMAGES.HERO_MODERN_ROOM}
              alt="Modern interior design space"
              width={500}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            />
          </div>

          {/* Right Column - Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '0 1 280px', minWidth: 260 }}>
            {/* Card 3 */}
            <div style={{ ...styles.infoCard, flex: 1, background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div style={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3 style={styles.cardTitle}>Sustainable Materials</h3>
              <p style={styles.cardDescription}>
                We prioritize eco-friendly materials and processes, helping you create beautiful spaces while caring for the environment.
              </p>
            </div>

            {/* Card 4 */}
            <div style={{ ...styles.infoCard, flex: 1, background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div style={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 style={styles.cardTitle}>AI-Powered Design</h3>
              <p style={styles.cardDescription}>
                Leverage advanced technology to visualize and refine your designs before production, ensuring perfect results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
