'use client';

import React from 'react';
import styles from './StyleTagSelector.module.css';

interface StyleTagSelectorProps {
  selectedStyles: string[];
  onStyleToggle: (style: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const styleOptions = [
  'Modern',
  'Contemporary',
  'Traditional',
  'Scandinavian',
  'Industrial',
  'Minimalist',
  'Bohemian',
  'Rustic',
  'Mid-Century Modern',
  'Art Deco',
  'Coastal',
  'Japanese',
  'Mediterranean',
  'Transitional',
  'Farmhouse',
  'Victorian',
  'French Country',
  'Tropical',
  'Eclectic',
  'Shabby Chic'
];

export default function StyleTagSelector({
  selectedStyles,
  onStyleToggle,
  searchQuery,
  onSearchChange
}: StyleTagSelectorProps) {
  const filteredStyles = styleOptions.filter(style =>
    style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.styleTagSelector}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search Scandinavian, Japandi"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.tagGrid}>
        {filteredStyles.map((style) => {
          const isSelected = selectedStyles.includes(style);
          return (
            <button
              key={style}
              className={`${styles.styleTag} ${isSelected ? styles.selected : ''}`}
              onClick={() => onStyleToggle(style)}
            >
              {style}
            </button>
          );
        })}
      </div>
    </div>
  );
}
