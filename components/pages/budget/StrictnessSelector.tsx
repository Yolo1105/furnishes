'use client';

import React from 'react';
import styles from './StrictnessSelector.module.css';

interface StrictnessSelectorProps {
  value: 'hard_cap' | 'soft_cap' | 'explore';
  flexibilityPct: number;
  onChange: (value: 'hard_cap' | 'soft_cap' | 'explore') => void;
  onFlexibilityChange: (value: number) => void;
}

export default function StrictnessSelector({
  value,
  flexibilityPct,
  onChange,
  onFlexibilityChange
}: StrictnessSelectorProps) {
  return (
    <div className={styles.strictnessSelector}>
      <div className={styles.options}>
        <label className={styles.option}>
          <input
            type="radio"
            name="strictness"
            value="hard_cap"
            checked={value === 'hard_cap'}
            onChange={() => onChange('hard_cap')}
          />
          <div className={styles.optionContent}>
            <span className={styles.optionLabel}>Hard cap</span>
            <span className={styles.optionDescription}>Never exceed this amount</span>
          </div>
        </label>

        <label className={styles.option}>
          <input
            type="radio"
            name="strictness"
            value="soft_cap"
            checked={value === 'soft_cap'}
            onChange={() => onChange('soft_cap')}
          />
          <div className={styles.optionContent}>
            <span className={styles.optionLabel}>Comfort zone</span>
            <span className={styles.optionDescription}>Allow some flexibility for perfect items</span>
          </div>
        </label>

        <label className={styles.option}>
          <input
            type="radio"
            name="strictness"
            value="explore"
            checked={value === 'explore'}
            onChange={() => onChange('explore')}
          />
          <div className={styles.optionContent}>
            <span className={styles.optionLabel}>Explore first</span>
            <span className={styles.optionDescription}>Show options, set budget later</span>
          </div>
        </label>
      </div>

      {value === 'soft_cap' && (
        <div className={styles.flexibilityControl}>
          <label className={styles.flexibilityLabel}>
            Allow up to {Math.round(flexibilityPct * 100)}% over
          </label>
          <input
            type="range"
            min="0.1"
            max="0.3"
            step="0.05"
            value={flexibilityPct}
            onChange={(e) => onFlexibilityChange(parseFloat(e.target.value))}
            className={styles.flexibilitySlider}
          />
        </div>
      )}
    </div>
  );
}
