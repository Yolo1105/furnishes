'use client';

import React from 'react';
import styles from './RatingButtons.module.css';

interface RatingButtonsProps {
  id: string;
  label: string;
  leftLabel?: string;
  rightLabel?: string;
  value: number; // 1-10
  onChange: (value: number) => void;
}

export default function RatingButtons({
  id,
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: RatingButtonsProps) {
  const handleClick = (rating: number) => {
    onChange(rating);
  };

  return (
    <div className={styles.ratingControl}>
      <label className={styles.label}>{label}</label>
      {(leftLabel || rightLabel) && (
        <div className={styles.labelRow}>
          {leftLabel && <span className={styles.leftLabel}>{leftLabel}</span>}
          {rightLabel && <span className={styles.rightLabel}>{rightLabel}</span>}
        </div>
      )}
      <div className={styles.buttonsContainer}>
        {Array.from({ length: 10 }, (_, i) => {
          const rating = i + 1;
          const isSelected = value === rating;
          return (
            <button
              key={rating}
              type="button"
              className={`${styles.ratingButton} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleClick(rating)}
              aria-label={`Rate ${rating} out of 10`}
            >
              {rating}
            </button>
          );
        })}
      </div>
    </div>
  );
}
