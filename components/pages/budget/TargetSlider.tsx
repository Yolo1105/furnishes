'use client';

import React from 'react';
import styles from './TargetSlider.module.css';

interface TargetSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export default function TargetSlider({
  min,
  max,
  value,
  onChange
}: TargetSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    // Snap to $500 increments
    const snapped = Math.round(newValue / 500) * 500;
    onChange(Math.max(min, Math.min(max, snapped)));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.targetSlider}>
      <div className={styles.labelRow}>
        <span className={styles.label}>TARGET</span>
        <span className={styles.recommended}>
          Recommended: ${min.toLocaleString()} – ${max.toLocaleString()}
        </span>
      </div>
      
      <div className={styles.sliderContainer}>
        <div className={styles.sliderTrack}>
          <div 
            className={styles.sliderFill}
            style={{ width: `${percentage}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={500}
            value={value}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>
        <div className={styles.valueDisplay}>
          <span className={styles.valueLabel}>Your target:</span>
          <span className={styles.valueAmount}>${value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
