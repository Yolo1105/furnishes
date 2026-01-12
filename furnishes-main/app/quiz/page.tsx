'use client';

import React from 'react';
import { StyleDiscoveryProvider } from '@/contexts/StyleDiscoveryContext';
import StyleDiscoveryQuiz from '@/components/pages/inspiration/StyleDiscoveryQuiz';
import styles from './QuizPage.module.css';

export default function QuizPage() {
  return (
    <StyleDiscoveryProvider>
      <div className={styles.quizPage}>
        <StyleDiscoveryQuiz />
      </div>
    </StyleDiscoveryProvider>
  );
}
