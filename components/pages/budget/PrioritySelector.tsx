'use client';

import React from 'react';
import styles from './PrioritySelector.module.css';

interface Priority {
  id: string;
  label: string;
  description: string;
}

interface PrioritySelectorProps {
  selected: string[];
  maxSelections: number;
  onToggle: (priorityId: string) => void;
}

const priorities: Priority[] = [
  {
    id: 'seating',
    label: 'Seating comfort',
    description: 'Quality sofa/chairs that last'
  },
  {
    id: 'storage',
    label: 'Storage capacity',
    description: 'Enough space for everything'
  },
  {
    id: 'lighting',
    label: 'Lighting quality',
    description: 'Layer ambient, task, accent'
  },
  {
    id: 'workspace',
    label: 'Workspace setup',
    description: 'Functional desk and chair'
  },
  {
    id: 'rug',
    label: 'Rug foundation',
    description: 'Quality anchor piece'
  }
];

export default function PrioritySelector({
  selected,
  maxSelections,
  onToggle
}: PrioritySelectorProps) {
  const isSelected = (id: string) => selected.includes(id);
  const isDisabled = (id: string) => !isSelected(id) && selected.length >= maxSelections;

  return (
    <div className={styles.prioritySelector}>
      <div className={styles.header}>
        <h3 className={styles.title}>PROTECT YOUR PRIORITIES</h3>
        <p className={styles.subtitle}>
          Pick {maxSelections} categories to prioritize. We&apos;ll protect these first.
        </p>
      </div>

      <div className={styles.priorityList}>
        {priorities.map((priority) => {
          const selected = isSelected(priority.id);
          const disabled = isDisabled(priority.id);

          return (
            <label
              key={priority.id}
              className={`${styles.priorityCard} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
            >
              <input
                type="checkbox"
                checked={selected}
                disabled={disabled}
                onChange={() => onToggle(priority.id)}
                className={styles.checkbox}
              />
              <div className={styles.priorityContent}>
                <div className={styles.priorityLabel}>{priority.label}</div>
                <div className={styles.priorityDescription}>{priority.description}</div>
              </div>
              {selected && (
                <div className={styles.starIcon}>★</div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
