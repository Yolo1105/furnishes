'use client';

import React from 'react';
import styles from './StyleModeSelector.module.css';

interface StyleModeSelectorProps {
  mode: 'known' | 'guided';
  onModeChange: (mode: 'known' | 'guided') => void;
}

export default function StyleModeSelector({ mode, onModeChange }: StyleModeSelectorProps) {
  return (
    <div className={styles.modeSelector}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Choose your approach</p>
        <p className={styles.description}>
          Already have a style in mind, or want us to help you find it?
        </p>
      </div>
      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeCard} ${mode === 'known' ? styles.active : ''}`}
          onClick={() => onModeChange('known')}
        >
          <p className={styles.modeTitle}>I already know my style</p>
          <p className={styles.modeDescription}>Fast lane for style-aware folks. Pick your style, accents, and guardrails.</p>
        </button>
        <button
          type="button"
          className={`${styles.modeCard} ${mode === 'guided' ? styles.active : ''}`}
          onClick={() => onModeChange('guided')}
        >
          <p className={styles.modeTitle}>Help me find my style</p>
          <p className={styles.modeDescription}>A playful discovery flow that learns your taste in minutes.</p>
        </button>
      </div>
    </div>
  );
}
