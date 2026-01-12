'use client';

import React from 'react';
import styles from './FeedbackRow.module.css';

export interface FeedbackRowProps {
  text: string;
  badge?: string; // "U" for user
}

export const FeedbackRow: React.FC<FeedbackRowProps> = ({ text, badge = 'U' }) => {
  return (
    <div className={styles.feedbackRow}>
      <span className={styles.feedbackText}>{text}</span>
      <div className={styles.feedbackBadge}>{badge}</div>
    </div>
  );
};
