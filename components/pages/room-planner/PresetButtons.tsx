'use client';

import React from 'react';
import styles from './PresetButtons.module.css';

interface Preset {
  id: string;
  name: string;
  dimensions: { width: number; length: number; ceiling: number };
  note: string;
}

interface PresetButtonsProps {
  selectedPresetId: string | null;
  onSelect: (preset: Preset) => void;
}

const presets: Preset[] = [
  {
    id: 'small',
    name: 'Small',
    dimensions: { width: 10, length: 10, ceiling: 9 },
    note: 'Cozy bedroom or office'
  },
  {
    id: 'standard',
    name: 'Standard',
    dimensions: { width: 12, length: 12, ceiling: 9 },
    note: 'Typical bedroom'
  },
  {
    id: 'large',
    name: 'Large',
    dimensions: { width: 14, length: 16, ceiling: 10 },
    note: 'Primary suite or living room'
  }
];

export default function PresetButtons({ selectedPresetId, onSelect }: PresetButtonsProps) {
  return (
    <div className={styles.presetButtons}>
      <div className={styles.label}>Quick start</div>
      <div className={styles.buttonGrid}>
        {presets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              className={`${styles.presetButton} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelect(preset)}
            >
              {isSelected && (
                <div className={styles.checkmark}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              <div className={styles.presetName}>{preset.name}</div>
              <div className={styles.presetDimensions}>
                {preset.dimensions.width}&apos; × {preset.dimensions.length}&apos;
              </div>
              <div className={styles.presetNote}>{preset.note}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
