'use client';

import React, { useEffect } from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import QuickChoice from '../components/QuickChoice';
import { quickChoices } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function QuickFirePage() {
  const { state, setAnswer, nextPage } = useStyleDiscovery();
  const selected = (state.answers['page-4'] as string[]) || [];
  const currentIndex = selected.length;

  const handleSelect = (choiceId: string) => {
    const newSelected = [...selected, choiceId];
    setAnswer('page-4', newSelected);
  };

  // Auto-advance to next page when all choices are made
  useEffect(() => {
    if (selected.length === quickChoices.length) {
      const timer = setTimeout(() => {
        nextPage();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selected.length, nextPage, quickChoices.length]);

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>Time for some quick choices. We're going to make you pick between two things, and there's no wrong answer - we just want to see what you're naturally drawn to.</h2>
        <p className={styles.instruction}>Just go with your gut on these, don't think too hard about it.</p>
        <p className={styles.hint}>8 rapid choices coming your way. Click what feels right and keep moving.</p>
      </div>
      <div className={styles.rightSection}>
        <QuickChoice
          pairs={quickChoices}
          currentIndex={currentIndex}
          selected={selected}
          onSelect={handleSelect}
        />
        <div className={styles.progressIndicator}>
          {Array.from({ length: quickChoices.length }, (_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${i < currentIndex ? styles.completed : ''} ${i === currentIndex ? styles.current : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
