'use client';

import React from 'react';
import styles from './ComfortLevelSelector.module.css';

interface ComfortLevel {
  id: 'value' | 'balanced' | 'premium';
  name: string;
  range: string;
  description: string;
}

interface ComfortLevelSelectorProps {
  selected: 'value' | 'balanced' | 'premium' | null;
  onSelect: (level: 'value' | 'balanced' | 'premium') => void;
}

const comfortLevels: ComfortLevel[] = [
  {
    id: 'value',
    name: 'Value',
    range: '$4-6k',
    description: 'Smart buys'
  },
  {
    id: 'balanced',
    name: 'Balanced',
    range: '$6-9k',
    description: 'Quality + value'
  },
  {
    id: 'premium',
    name: 'Premium',
    range: '$9-15k',
    description: 'Top materials'
  }
];

export default function ComfortLevelSelector({
  selected,
  onSelect
}: ComfortLevelSelectorProps) {
  return (
    <div className={styles.comfortLevelSelector}>
      <div className={styles.segmentedControl}>
        {comfortLevels.map((level) => (
          <button
            key={level.id}
            className={`${styles.segment} ${selected === level.id ? styles.selected : ''}`}
            onClick={() => onSelect(level.id)}
          >
            <div className={styles.segmentName}>{level.name}</div>
            <div className={styles.segmentRange}>{level.range}</div>
            <div className={styles.segmentDescription}>{level.description}</div>
            {selected === level.id && (
              <div className={styles.checkmark}>Selected</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
