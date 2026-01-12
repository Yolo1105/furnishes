'use client';

import React from 'react';
import Image from 'next/image';
import { FONT_MANROPE, commonStyles } from '@/components/shared/styles/commonStyles';
import { CSSProperties } from 'react';
import { IMAGES } from '@/constants/images';

const styles = {
  sectionLabel: {
    color: 'black',
    fontWeight: 500,
    fontSize: '1rem',
    marginBottom: '0.5rem',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  subHeading: {
    fontWeight: 600,
    fontSize: '1.18rem',
    color: '#111',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  quoteText: {
    fontSize: '2.2rem',
    fontWeight: 900,
    color: '#111',
    letterSpacing: '0.5px',
    display: 'inline-block',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  iconWrapper: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as CSSProperties,
  iconCircleBg: {
    position: 'absolute',
    right: '-6px',
    bottom: '-6px',
    width: '60px',
    height: '60px',
    background: '#FF7A1A',
    borderRadius: '50%',
    zIndex: 0,
    opacity: 1,
  } as CSSProperties,
  iconInnerCircle: {
    background: '#FFFFFF',
    borderRadius: '50%',
    padding: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  } as CSSProperties,
  featureTitle: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#232323',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  featureSubtitle: {
    color: '#666',
    fontSize: '1rem',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  statNumber: {
    fontSize: '3.2rem',
    fontWeight: 700,
    color: '#111',
    lineHeight: 1,
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  statSuffix: {
    fontSize: '2rem',
    fontWeight: 400,
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  statDescription: {
    color: '#111',
    fontSize: '1rem',
    fontFamily: FONT_MANROPE,
  } as CSSProperties,
  infoCard: {
    background: 'transparent',
    borderRadius: '1.2rem',
    boxShadow: 'none',
    padding: '1.8rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as CSSProperties,
};

export default function InfoSection() {
  return (
    <section id="info" className="relative z-10 flex min-h-screen flex-col items-center justify-center p-24" style={{ backgroundColor: '#FFFEF8', position: 'relative', overflow: 'visible', borderTop: '1px solid rgba(229, 94, 0, 0.15)' }}>
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 3 }}>
        {/* About Us Block */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', width: '100%' }}>
          <div style={{ flex: '1 1 320px', minWidth: 220 }}>
            <div style={{ ...styles.sectionLabel, color: '#E55E00' }}>
              About Us <span style={{ marginLeft: 8, borderBottom: '3px solid #E55E00', display: 'inline-block', width: 60, verticalAlign: 'middle' }}></span>
            </div>
            <div style={{ ...commonStyles.headingLarge, marginBottom: 0 }}>
              For Urban<br />Living.
            </div>
          </div>
          <div style={{ flex: '2 1 400px', minWidth: 220, textAlign: 'right', alignSelf: 'center' }}>
            <div style={{ ...commonStyles.bodyText, maxWidth: 600, marginLeft: 'auto' }}>
              We believe that good design should be easy to accept and comfortable to enjoy. For this reason, we collaborate with the best local designers to create furniture that is suitable for the needs of urban life—furniture that is pleasant to look at, reliable for the long term, but not difficult to deliver.
            </div>
          </div>
        </div>

        {/* Philosophy section with image */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: '420px' }}>
          <div style={{ flex: '1 1 520px', minWidth: 350, maxWidth: 520, marginLeft: '2vw', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', position: 'relative', zIndex: 2 }}>
            <Image
              src={IMAGES.HERO_MODERN_ROOM}
              alt="Modern minimalist living room"
              width={520}
              height={420}
              style={{ width: '520px', height: '420px', objectFit: 'cover', borderRadius: '0', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', display: 'block', position: 'relative', zIndex: 2 }}
            />
          </div>
          <div style={{ flex: '1 1 340px', minWidth: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2vw 0', marginLeft: '2vw', zIndex: 3, background: 'transparent', textAlign: 'right' }}>
            <h1 style={{ ...commonStyles.headingLarge, marginBottom: '1.2rem', textAlign: 'right', maxWidth: 520, marginLeft: 'auto' }}>
              Futuristic &<br />Minimalist.
            </h1>
            <div style={{ ...styles.subHeading, margin: '2.2rem 0 0.7rem 0', textAlign: 'right', maxWidth: 520, marginLeft: 'auto', color: '#E55E00' }}>
              Our Philosophy,
            </div>
            <div style={{ ...commonStyles.bodyText, fontSize: '1.2rem', textAlign: 'right', maxWidth: 520, marginLeft: 'auto' }}>
              You don&apos;t have to worry about the results because all of these interiors are made by people who are professionals in their fields with an elegant and luxurious style and with premium quality materials.
            </div>
          </div>
        </div>

        {/* Experience sentence above the feature icons row */}
        <div style={{ width: '100%', textAlign: 'center', margin: 0, padding: 0 }}>
          <span style={styles.quoteText}>
            &quot;We provide you best experience&quot;
          </span>
        </div>

        {/* Feature row below the existing content */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '4vw', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {/* Free Shipping */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 220 }}>
            <span style={styles.iconWrapper}>
              <div style={styles.iconCircleBg} />
              <span style={styles.iconInnerCircle}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C3A2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 3h15v13H1z" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </span>
            </span>
            <div>
              <div style={styles.featureTitle}>Free Shipping</div>
              <div style={styles.featureSubtitle}>Free shipping for order above $180</div>
            </div>
          </div>
          {/* Flexible Payment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 220 }}>
            <span style={styles.iconWrapper}>
              <div style={styles.iconCircleBg} />
              <span style={styles.iconInnerCircle}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C3A2F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <path d="M1 10h22" />
                  <path d="M5 16h4" />
                </svg>
              </span>
            </span>
            <div>
              <div style={styles.featureTitle}>Flexible Payment</div>
              <div style={styles.featureSubtitle}>Multiple secure payment options</div>
            </div>
          </div>
          {/* 24x7 Support */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 220 }}>
            <span style={styles.iconWrapper}>
              <div style={styles.iconCircleBg} />
              <span style={styles.iconInnerCircle}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C3A2F" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </span>
            </span>
            <div>
              <div style={styles.featureTitle}>24×7 Support</div>
              <div style={styles.featureSubtitle}>We support online all days.</div>
            </div>
          </div>
        </div>

        {/* Stats row below the feature icons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '2rem',
          marginTop: '3rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          {/* 900+ Products */}
          <div style={{ ...styles.infoCard, flex: '1 1 320px', minWidth: 280, maxWidth: 380, textAlign: 'center', alignItems: 'center', background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
              <span style={styles.statNumber}>900<span style={styles.statSuffix}>+</span></span>
            </div>
            <div style={styles.statDescription}>Products that we have created<br />and sold on the market</div>
          </div>
          {/* 20K+ Customers */}
          <div style={{ ...styles.infoCard, flex: '1 1 320px', minWidth: 280, maxWidth: 380, textAlign: 'center', alignItems: 'center', background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
              <span style={styles.statNumber}>20K<span style={styles.statSuffix}>+</span></span>
            </div>
            <div style={styles.statDescription}>Happy and loyal customers<br />buy our products</div>
          </div>
          {/* 98% Return Rate */}
          <div style={{ ...styles.infoCard, flex: '1 1 320px', minWidth: 280, maxWidth: 380, textAlign: 'center', alignItems: 'center', background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
              <span style={styles.statNumber}>98<span style={styles.statSuffix}>%</span></span>
            </div>
            <div style={styles.statDescription}>Customers who have purchased<br />will come back again</div>
          </div>
        </div>
      </div>
    </section>
  );
}
