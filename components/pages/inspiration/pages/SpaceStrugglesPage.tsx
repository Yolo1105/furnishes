'use client';

import React from 'react';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import CheckboxGroup from '../components/CheckboxGroup';
import { spaceStrugglesOptions } from '@/data/style-discovery-data';
import styles from './QuestionPage.module.css';

export default function SpaceStrugglesPage() {
  const { state, setAnswer } = useStyleDiscovery();
  const selected = (state.answers['page-9'] as string[]) || [];

  const handleToggle = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setAnswer('page-9', newSelected);
  };

  return (
    <div className={styles.questionPage}>
      <div className={styles.leftSection}>
        <h2 className={styles.question}>What&apos;s actually bothering you in your current space? Maybe it&apos;s the lighting that never feels right, or you can&apos;t relax even when everything is clean, or you&apos;re constantly feeling like there&apos;s too much stuff everywhere.</h2>
        <p className={styles.instruction}>Select all that apply - the more honest you are, the better we can help you figure out what to prioritize.</p>
        <p className={styles.hint}>
          This helps us understand what&apos;s most important for you to fix or improve.
        </p>
      </div>
      <div className={styles.rightSection}>
        <CheckboxGroup
          options={spaceStrugglesOptions}
          selected={selected}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
