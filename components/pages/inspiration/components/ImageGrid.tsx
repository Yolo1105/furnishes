'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ImageGrid.module.css';
import type { SpaceOption } from '@/data/style-discovery-data';

interface ImageGridProps {
  options: SpaceOption[];
  selected: string[];
  onSelect: (id: string) => void;
  minSelections?: number;
  maxSelections?: number;
}

export default function ImageGrid({
  options,
  selected,
  onSelect,
  minSelections = 0,
  maxSelections = 3,
}: ImageGridProps) {
  const handleClick = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > minSelections) {
        onSelect(id);
      }
    } else {
      if (selected.length < maxSelections) {
        onSelect(id);
      }
    }
  };

  return (
    <div className={styles.imageGrid}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const isDisabled = !isSelected && selected.length >= maxSelections;

        return (
          <div
            key={option.id}
            className={`${styles.imageCard} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
            onClick={() => !isDisabled && handleClick(option.id)}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={option.image}
                alt={option.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {isSelected && (
                <div className={styles.checkmark}>
                  <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#E55E00" />
                    <path
                      d="M6 10L9 13L14 7"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className={styles.label}>{option.name}</p>
          </div>
        );
      })}
    </div>
  );
}
