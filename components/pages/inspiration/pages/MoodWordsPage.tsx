'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import WordTags from '../components/WordTags';
import { moodWords } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function MoodWordsPage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-2'] as string[]) || [];

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setAnswer('page-2', newSelected);
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>If someone asked you "what vibe are you going for?" at a party, how would you describe your dream home in just a few words?</h2>
        <p className={styles.instruction}>Pick 4-6 words that really resonate with you, the ones that make you think "yeah, that's exactly it."</p>
      </div>
      <div className={styles.rightSection}>
        <WordTags
          words={moodWords}
          selected={selected}
          onSelect={handleToggle}
          minSelections={4}
          maxSelections={6}
        />
        <p className={styles.selectionCount}>
          {selected.length} selected
        </p>
      </div>
    </div>
  );
}
