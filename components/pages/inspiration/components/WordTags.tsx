'use client';

import React from 'react';
import styles from './WordTags.module.css';
import type { MoodWord } from '@/data/style-discovery-data';

interface WordTagsProps {
  words: MoodWord[];
  selected: string[];
  onSelect: (id: string) => void;
  minSelections?: number;
  maxSelections?: number;
}

export default function WordTags({
  words,
  selected,
  onSelect,
  minSelections = 0,
  maxSelections = 6,
}: WordTagsProps) {
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
    <div className={styles.wordTags}>
      {words.map((word) => {
        const isSelected = selected.includes(word.id);
        const isDisabled = !isSelected && selected.length >= maxSelections;

        return (
          <button
            key={word.id}
            className={`${styles.tag} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
            onClick={() => !isDisabled && handleClick(word.id)}
            disabled={isDisabled}
          >
            {word.word}
          </button>
        );
      })}
    </div>
  );
}
