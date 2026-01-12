'use client';

import React from 'react';
import Image from 'next/image';
import styles from './SceneSelector.module.css';
import type { SceneOption } from '@/data/style-discovery-data';

interface SceneSelectorProps {
  options: SceneOption[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function SceneSelector({
  options,
  selected,
  onSelect,
}: SceneSelectorProps) {
  return (
    <div className={styles.sceneSelector}>
      <div className={styles.mainImage}>
        {selected && (
          <>
            <Image
              src={options.find((opt) => opt.id === selected)?.image || options[0].image}
              alt={options.find((opt) => opt.id === selected)?.name || ''}
              fill
              className={styles.image}
              sizes="100vw"
            />
            <div className={styles.overlay}>
              <p className={styles.description}>
                {options.find((opt) => opt.id === selected)?.description}
              </p>
            </div>
          </>
        )}
      </div>
      <div className={styles.selector}>
        {options.map((option) => (
          <div
            key={option.id}
            className={styles.option}
            onClick={() => onSelect(option.id)}
          >
            <div className={`${styles.dot} ${selected === option.id ? styles.selected : ''}`} />
            <span className={`${styles.name} ${selected === option.id ? styles.selected : ''}`}>
              {option.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
