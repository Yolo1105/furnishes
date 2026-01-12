'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import { wellnessGoalOptions } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function WellnessGoalPage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-10'] as string) || null;

  const handleSelect = (id: string) => {
    setAnswer('page-10', id);
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>
          If your home could give you one thing - like if it had magical powers and could solve one problem or give you one benefit - what would that be? Better sleep? A space where you can actually focus? Or just a calm environment where your mind can finally quiet down?
        </h2>
        <p className={styles.instruction}>Think of this as your primary wellness goal. What&apos;s the one thing your space could do for you that would make the biggest difference in how you feel every day?</p>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.goalCards}>
          {wellnessGoalOptions.map((option) => (
            <div
              key={option.id}
              className={`${styles.goalCard} ${selected === option.id ? styles.selected : ''}`}
              onClick={() => handleSelect(option.id)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
