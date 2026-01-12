'use client';

import React from 'react';
import styles from './SliderControl.module.css';

interface SliderControlProps {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export default function SliderControl({
  id,
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: SliderControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={styles.sliderControl}>
      <label className={styles.label}>{label}</label>
      <div className={styles.sliderWrapper}>
        <span className={styles.leftLabel}>{leftLabel}</span>
        <div className={styles.trackContainer}>
          <input
            type="range"
            id={id}
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>
        <span className={styles.rightLabel}>{rightLabel}</span>
      </div>
    </div>
  );
}
