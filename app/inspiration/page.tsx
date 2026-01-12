'use client';

import React from 'react';
import InspirationHub from '@/components/pages/inspiration/InspirationHub';
import styles from './InspirationPage.module.css';

export default function InspirationPage() {
  return (
    <div className={styles.inspirationPage}>
      <InspirationHub />
    </div>
  );
}
