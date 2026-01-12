'use client';

import React from 'react';
import styles from './GuidanceModal.module.css';

type GuidanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const GuidanceModal: React.FC<GuidanceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.guidanceModalOverlay} onClick={onClose}>
      <div className={styles.guidanceModal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.guidanceCloseButton} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className={styles.guidanceContent}>
          <h2 className={styles.guidanceTitle}>Welcome to Furnishes</h2>
          <p className={styles.guidanceDescription}>
            Your AI-powered interior design platform for creating personalized furniture and spaces.
          </p>

          <div className={styles.guidanceSections}>
            {/* Navigation Guide */}
            <div className={styles.guidanceSection}>
              <div className={styles.guidanceSectionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className={styles.guidanceSectionContent}>
                <h3 className={styles.guidanceSectionTitle}>Navigation</h3>
                <p className={styles.guidanceSectionText}>
                  Explore <strong>Collections</strong> to browse furniture, get <strong>Inspiration</strong> for design ideas, use the <strong>Playground</strong> to visualize your space in 3D, and learn more <strong>About</strong> us.
                </p>
              </div>
            </div>

            {/* Features Guide */}
            <div className={styles.guidanceSection}>
              <div className={styles.guidanceSectionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className={styles.guidanceSectionContent}>
                <h3 className={styles.guidanceSectionTitle}>AI-Powered Design</h3>
                <p className={styles.guidanceSectionText}>
                  Our AI assistant helps you design furniture that fits your style, space, and budget. Create personalized pieces with our 3D visualizer.
                </p>
              </div>
            </div>

            {/* Getting Started */}
            <div className={styles.guidanceSection}>
              <div className={styles.guidanceSectionIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div className={styles.guidanceSectionContent}>
                <h3 className={styles.guidanceSectionTitle}>Getting Started</h3>
                <p className={styles.guidanceSectionText}>
                  Start by exploring our <strong>Collections</strong>, then use the <strong>Playground</strong> to design your space. Our AI will guide you through the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidanceModal;
