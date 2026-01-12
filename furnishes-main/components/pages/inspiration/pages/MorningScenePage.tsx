'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import SceneSelector from '../components/SceneSelector';
import { sceneOptions } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function MorningScenePage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-3'] as string) || null;

  const handleSelect = (id: string) => {
    setAnswer('page-3', id);
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>
          Picture this: it's Sunday morning, that perfect lazy Sunday. You wake up in your dream home and open your eyes. What's the first thing you see? What does the light look like? What's the mood in the room?
        </h2>
      </div>
      <div className={styles.rightSection}>
        <SceneSelector
          options={sceneOptions}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
