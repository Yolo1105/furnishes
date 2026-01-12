'use client';

import React from 'react';
import styles from './QuizHeader.module.css';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';

interface QuizHeaderProps {
  showPageNumber?: boolean;
}

export default function QuizHeader({ showPageNumber = true }: QuizHeaderProps) {
  const { state } = useStyleDiscovery();

  const currentPageNumber = state.currentPage > 0 ? state.currentPage : 1;
  const totalPages = 12;

  return (
    <header className={styles.header}>
      <div className={styles.rightSection}>
        {showPageNumber && state.currentPage > 0 && (
          <span className={styles.pageNumber}>
            {currentPageNumber} / {totalPages}
          </span>
        )}
      </div>
    </header>
  );
}
