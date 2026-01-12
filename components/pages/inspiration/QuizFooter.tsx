'use client';

import React from 'react';
import styles from './QuizFooter.module.css';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';

interface QuizFooterProps {
  onContinue: () => void;
  canContinue?: boolean;
  continueLabel?: string;
}

export default function QuizFooter({
  onContinue,
  canContinue = true,
  continueLabel = 'Continue',
}: QuizFooterProps) {
  const { state, prevPage } = useStyleDiscovery();

  const getSectionQuote = () => {
    switch (state.currentPage) {
      case 0:
        return "Discover the space that truly reflects who you are.";
      case 1:
        return "Your first impression tells us everything about your comfort zone.";
      case 2:
        return "Words reveal the essence of your personal style.";
      case 3:
        return "Morning scenes capture your ideal daily rhythm.";
      case 4:
        return "Quick choices reveal your authentic preferences.";
      case 5:
        return "Colors speak to your emotional connection with space.";
      case 6:
        return "Texture is the language of touch and comfort.";
      case 7:
        return "Furniture style defines your aesthetic identity.";
      case 8:
        return "Your daily life shapes your space needs.";
      case 9:
        return "Understanding challenges helps us find solutions.";
      case 10:
        return "Wellness goals guide your space transformation.";
      case 11:
        return "Your final choice reflects your true vision.";
      case 12:
        return "Welcome to your personalized space journey.";
      default:
        return "Discover the space that truly reflects who you are.";
    }
  };

  const handleBack = () => {
    prevPage();
  };

  const handleContinue = () => {
    if (canContinue) {
      onContinue();
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        {state.currentPage > 0 && (
          <button className={styles.navButton} onClick={handleBack} aria-label="Previous question">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Previous</span>
          </button>
        )}
      </div>
      <div className={styles.quoteSection}>
        <p className={styles.quote}>&quot;{getSectionQuote()}&quot;</p>
      </div>
      <div className={styles.rightSection}>
        <button
          className={`${styles.navButton} ${styles.navButtonPrimary} ${!canContinue ? styles.disabled : ''}`}
          onClick={handleContinue}
          disabled={!canContinue}
          aria-label={continueLabel}
        >
          <span>{continueLabel}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </footer>
  );
}
