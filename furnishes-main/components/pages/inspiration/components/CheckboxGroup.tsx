'use client';

import React from 'react';
import styles from './CheckboxGroup.module.css';

interface CheckboxOption {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

export default function CheckboxGroup({
  options,
  selected,
  onToggle,
}: CheckboxGroupProps) {
  return (
    <div className={styles.checkboxGroup}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <div
            key={option.id}
            className={`${styles.checkboxCard} ${isSelected ? styles.selected : ''}`}
            onClick={() => onToggle(option.id)}
          >
            <div className={styles.checkbox}>
              {isSelected ? (
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" rx="4" fill="#E55E00" />
                  <path
                    d="M6 10L9 13L14 7"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <rect width="20" height="20" rx="4" fill="transparent" stroke="#E8E8E8" strokeWidth="2" />
                </svg>
              )}
            </div>
            <span className={styles.label}>{option.label}</span>
          </div>
        );
      })}
    </div>
  );
}
