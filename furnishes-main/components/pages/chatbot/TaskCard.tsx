'use client';

import React, { useState } from 'react';
import styles from './TaskCard.module.css';

export interface TaskCardProps {
  id: string;
  text: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string, bookmarked: boolean) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  text,
  isBookmarked = false,
  onBookmarkToggle,
}) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    if (onBookmarkToggle) {
      onBookmarkToggle(id, newBookmarked);
    }
  };

  return (
    <div className={styles.workflowItem}>
      <div className={styles.workflowDot} />
      <div className={styles.workflowText}>{text}</div>
      <button
        className={styles.bookmarkButton}
        onClick={handleBookmarkClick}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={bookmarked ? styles.bookmarked : ''}
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
};
