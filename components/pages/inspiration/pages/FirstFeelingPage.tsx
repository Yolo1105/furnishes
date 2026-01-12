'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import ImageGrid from '../components/ImageGrid';
import { spaceOptions } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function FirstFeelingPage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-1'] as string[]) || [];

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setAnswer('page-1', newSelected);
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>When you're scrolling through interior photos or walking into someone's house, which spaces make you feel like you could just plop down and be totally comfortable?</h2>
        <p className={styles.instruction}>Pick 2-3 that really speak to you, the ones where you're like "yeah, I could see myself living here."</p>
        <p className={styles.hint}>Don't overthink it. Just trust your gut and go with what catches your eye.</p>
      </div>
      <div className={styles.rightSection}>
        <ImageGrid
          options={spaceOptions}
          selected={selected}
          onSelect={handleToggle}
          minSelections={2}
          maxSelections={3}
        />
        <p className={styles.selectionCount}>
          {selected.length} selected
        </p>
      </div>
    </div>
  );
}
