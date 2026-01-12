'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import TextureGrid from '../components/TextureGrid';
import { textureOptions } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function TextureTouchPage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-6'] as string[]) || [];

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setAnswer('page-6', newSelected);
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>
          Imagine walking through your perfect room and running your hand across all the surfaces - the furniture, the walls, the fabrics. What textures are you feeling? Smooth and sleek, or rough and natural? Soft and cozy, or crisp and clean?
        </h2>
        <p className={styles.instruction}>Think about what textures would make you want to touch everything in the room, the ones that just feel good under your fingertips.</p>
        <p className={styles.hint}>Pick 3 textures that really speak to you.</p>
      </div>
      <div className={styles.rightSection}>
        <TextureGrid
          options={textureOptions}
          selected={selected}
          onSelect={handleToggle}
          maxSelections={3}
        />
        <p className={styles.selectionCount}>
          {selected.length} of 3 selected
        </p>
      </div>
    </div>
  );
}
