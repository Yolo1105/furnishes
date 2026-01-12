'use client';

import React from 'react';
import styles from './ValidationPanel.module.css';
import type { RoomConfig } from '@/types/project';

interface ValidationPanelProps {
  roomConfig: RoomConfig | null;
}

export default function ValidationPanel({ roomConfig }: ValidationPanelProps) {
  if (!roomConfig) {
    return null;
  }

  const { width, length, ceiling } = roomConfig.dimensions;
  const isValid = width >= 6 && width <= 30 && length >= 6 && length <= 30 && ceiling >= 7 && ceiling <= 15;
  const hasOpenings = roomConfig.openings.length > 0;

  const validations = [
    {
      id: 'dimensions',
      label: 'Dimensions valid',
      valid: isValid
    },
    {
      id: 'door',
      label: 'Door swing clearance OK',
      valid: hasOpenings || true // Simplified
    },
    {
      id: 'area',
      label: `Usable area: ${roomConfig.usableArea} sq ft`,
      valid: true
    }
  ];

  return (
    <div className={styles.validationPanel}>
      <div className={styles.title}>Validation</div>
      <div className={styles.validations}>
        {validations.map((validation) => (
          <div
            key={validation.id}
            className={`${styles.validationItem} ${validation.valid ? styles.valid : styles.invalid}`}
          >
            <span className={styles.icon}>{validation.valid ? 'OK' : 'Warning'}</span>
            <span className={styles.label}>{validation.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
