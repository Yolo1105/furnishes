'use client';

import React, { useState } from 'react';
import styles from '../RightSidebar.module.css';

const SearchContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const recentSearches = [
    'Modern living room sofa',
    'Scandinavian dining table',
    'Minimalist bedroom set',
    'Industrial office desk',
  ];
  
  const trendingSearches = [
    'Mid-century modern',
    'Velvet sofa',
    'Accent chairs',
    'Console table',
    'Area rugs',
  ];

  return (
    <div className={styles.searchContent}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Search</h2>
        <p className={styles.sectionDescription}>Find furniture, styles, and inspiration for your space.</p>
      </div>
      
      {/* Search Input */}
      <div className={styles.searchInputWrapper}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for furniture, rooms, styles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Recent Searches */}
      <div className={styles.searchSection}>
        <div className={styles.searchSectionHeader}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Recent Searches</span>
        </div>
        <div className={styles.recentSearchList}>
          {recentSearches.map((item, index) => (
            <button key={index} className={styles.recentSearchItem}>
              {item}
            </button>
          ))}
        </div>
      </div>
      
      {/* Trending Searches */}
      <div className={styles.searchSection}>
        <div className={styles.searchSectionHeader}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span>Trending Searches</span>
        </div>
        <div className={styles.trendingTags}>
          {trendingSearches.map((tag, index) => (
            <button key={index} className={styles.trendingTag}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;
