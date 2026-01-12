'use client';

import React from 'react';
import styles from './QuickChoice.module.css';
import type { QuickChoicePair } from '@/data/style-discovery-data';

interface QuickChoiceProps {
  pairs: QuickChoicePair[];
  currentIndex: number;
  selected: string[];
  onSelect: (choiceId: string) => void;
}

export default function QuickChoice({
  pairs,
  currentIndex,
  selected,
  onSelect,
}: QuickChoiceProps) {
  if (currentIndex >= pairs.length) {
    return null;
  }

  const currentPair = pairs[currentIndex];
  const leftSelected = selected.includes(currentPair.left.id);
  const rightSelected = selected.includes(currentPair.right.id);

  const handleSelect = (choiceId: string) => {
    onSelect(choiceId);
  };

  return (
    <div className={styles.quickChoice}>
      <div
        className={`${styles.choiceCard} ${leftSelected ? styles.selected : ''}`}
        onClick={() => handleSelect(currentPair.left.id)}
      >
        <div className={styles.cardContent}>
          {currentPair.left.image && (
            <div className={styles.imagePlaceholder} />
          )}
          <span className={styles.label}>{currentPair.left.label}</span>
        </div>
      </div>
      <span className={styles.or}>or</span>
      <div
        className={`${styles.choiceCard} ${rightSelected ? styles.selected : ''}`}
        onClick={() => handleSelect(currentPair.right.id)}
      >
        <div className={styles.cardContent}>
          {currentPair.right.image && (
            <div className={styles.imagePlaceholder} />
          )}
          <span className={styles.label}>{currentPair.right.label}</span>
        </div>
      </div>
    </div>
  );
}
