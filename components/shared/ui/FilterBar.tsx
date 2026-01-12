'use client';

import React from 'react';
import styles from './FilterBar.module.css';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilters: FilterOption[];
  activeCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  styleFilters: FilterOption[];
  activeStyles: string[];
  onStyleToggle: (styleId: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilters,
  activeCategories,
  onCategoryToggle,
  styleFilters,
  activeStyles,
  onStyleToggle,
}) => {
  return (
    <div className={styles.filterBar}>
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.searchIcon}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search designs, authors, tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Category Filters */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Categories:</span>
        <div className={styles.filterButtons}>
          {categoryFilters.map((filter) => {
            const isActive = activeCategories.includes(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => onCategoryToggle(filter.id)}
                className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''}`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Style Filters */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Styles:</span>
        <div className={styles.filterButtons}>
          {styleFilters.map((filter) => {
            const isActive = activeStyles.includes(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => onStyleToggle(filter.id)}
                className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''}`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
