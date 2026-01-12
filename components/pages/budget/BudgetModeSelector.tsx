'use client';

import React from 'react';
import styles from './BudgetModeSelector.module.css';

interface BudgetModeSelectorProps {
  mode: 'known' | 'guided';
  onModeChange: (mode: 'known' | 'guided') => void;
}

export default function BudgetModeSelector({ mode, onModeChange }: BudgetModeSelectorProps) {
  return (
    <div className={styles.modeSelector}>
      <div className={styles.modeToggle}>
        {(['known', 'guided'] as const).map((modeOption) => (
          <button
            key={modeOption}
            type="button"
            className={`${styles.modeOption} ${mode === modeOption ? styles.active : ''}`}
            onClick={() => onModeChange(modeOption)}
          >
            {modeOption === 'known' ? 'I already have a budget' : 'Help me find my budget'}
          </button>
        ))}
      </div>
    </div>
  );
}
