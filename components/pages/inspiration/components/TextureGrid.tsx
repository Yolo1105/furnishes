'use client';

import React from 'react';
import Image from 'next/image';
import styles from './TextureGrid.module.css';
import type { TextureOption } from '@/data/style-discovery-data';

interface TextureGridProps {
  options: TextureOption[];
  selected: string[];
  onSelect: (id: string) => void;
  maxSelections?: number;
}

export default function TextureGrid({
  options,
  selected,
  onSelect,
  maxSelections = 3,
}: TextureGridProps) {
  const handleClick = (id: string) => {
    if (selected.includes(id)) {
      onSelect(id);
    } else {
      if (selected.length < maxSelections) {
        onSelect(id);
      }
    }
  };

  return (
    <div className={styles.textureGrid}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const isDisabled = !isSelected && selected.length >= maxSelections;

        return (
          <div
            key={option.id}
            className={`${styles.textureCard} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
            onClick={() => !isDisabled && handleClick(option.id)}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={option.image}
                alt={option.name}
                fill
                className={styles.image}
                sizes="88px"
              />
            </div>
            <p className={styles.name}>{option.name}</p>
          </div>
        );
      })}
    </div>
  );
}
