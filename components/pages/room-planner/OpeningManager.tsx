'use client';

import React from 'react';
import styles from './OpeningManager.module.css';
import type { RoomConfig } from '@/types/project';

interface OpeningManagerProps {
  openings: RoomConfig['openings'];
  onChange: (openings: RoomConfig['openings']) => void;
}

export default function OpeningManager({ openings, onChange }: OpeningManagerProps) {
  const addDoor = () => {
    const newOpening: RoomConfig['openings'][0] = {
      id: `door-${Date.now()}`,
      type: 'door',
      position: { x: 0, y: 0 },
      swing: 'inward'
    };
    onChange([...openings, newOpening]);
  };

  const addWindow = () => {
    const newOpening: RoomConfig['openings'][0] = {
      id: `window-${Date.now()}`,
      type: 'window',
      position: { x: 0, y: 0 },
      size: 'standard'
    };
    onChange([...openings, newOpening]);
  };

  const removeOpening = (id: string) => {
    onChange(openings.filter(op => op.id !== id));
  };

  const updateOpening = (id: string, updates: Partial<RoomConfig['openings'][0]>) => {
    onChange(openings.map(op => op.id === id ? { ...op, ...updates } : op));
  };

  return (
    <div className={styles.openingManager}>
      {openings.map((opening) => (
        <div key={opening.id} className={styles.openingCard}>
          <div className={styles.openingIcon}>
            {opening.type === 'door' ? 'Door' : 'Window'}
          </div>
          <div className={styles.openingContent}>
            <div className={styles.openingType}>
              {opening.type === 'door' ? 'Entry door' : 'Window'}
            </div>
            {opening.type === 'door' && (
              <select
                className={styles.openingSelect}
                value={opening.swing || 'inward'}
                onChange={(e) => updateOpening(opening.id, { swing: e.target.value as 'inward' | 'outward' })}
              >
                <option value="inward">Swing: Inward</option>
                <option value="outward">Swing: Outward</option>
              </select>
            )}
            {opening.type === 'window' && (
              <select
                className={styles.openingSelect}
                value={opening.size || 'standard'}
                onChange={(e) => updateOpening(opening.id, { size: e.target.value as 'standard' | 'large' })}
              >
                <option value="standard">Size: Standard</option>
                <option value="large">Size: Large</option>
              </select>
            )}
          </div>
          <button
            className={styles.removeButton}
            onClick={() => removeOpening(opening.id)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className={styles.addButtons}>
        <button className={styles.addButton} onClick={addDoor}>
          + Add door
        </button>
        <button className={styles.addButton} onClick={addWindow}>
          + Add window
        </button>
      </div>
    </div>
  );
}
