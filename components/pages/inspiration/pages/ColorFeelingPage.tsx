'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import ColorPalette from '../components/ColorPalette';
import { colorPalettes } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function ColorFeelingPage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-5'] as string) || null;

  const handleSelect = (id: string) => {
    setAnswer('page-5', id);
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>Colors have a real impact on how you feel. When you're stressed or need to unwind, which of these palettes would actually help you feel calm and relaxed?</h2>
        <p className={styles.instruction}>
          If you had a rough day and walked into a room with one of these color schemes, which one would make you feel like you could finally take a deep breath?
        </p>
      </div>
      <div className={styles.rightSection}>
        <ColorPalette
          palettes={colorPalettes}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
