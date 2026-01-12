import React from 'react';
import styles from './ThinkingIndicator.module.css';

interface ThinkingIndicatorProps {
  statusText: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ statusText }) => {
  return (
    <div className={styles.container} aria-live="polite" role="status">
      <span className={styles.text}>{statusText}</span>
      <span className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
    </div>
  );
};
