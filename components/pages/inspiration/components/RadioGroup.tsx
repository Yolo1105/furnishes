'use client';

import React from 'react';
import styles from './RadioGroup.module.css';

interface RadioOption {
  id: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  name: string;
}

export default function RadioGroup({
  options,
  selected,
  onSelect,
  name,
}: RadioGroupProps) {
  return (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label
          key={option.id}
          className={styles.radioOption}
          onClick={() => onSelect(option.id)}
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={selected === option.id}
            onChange={() => onSelect(option.id)}
            className={styles.radioInput}
          />
          <span className={styles.radioCircle} />
          <span className={styles.radioLabel}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
