'use client';

import React from 'react';
import styles from './ColorPalette.module.css';
import type { ColorPalette as ColorPaletteType } from '@/data/style-discovery-data';

interface ColorPaletteProps {
  palettes: ColorPaletteType[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function ColorPalette({
  palettes,
  selected,
  onSelect,
}: ColorPaletteProps) {
  return (
    <div className={styles.colorPalettes}>
      {palettes.map((palette) => (
        <div
          key={palette.id}
          className={styles.paletteWrapper}
          onClick={() => onSelect(palette.id)}
        >
          <div
            className={`${styles.palette} ${selected === palette.id ? styles.selected : ''}`}
          >
            {palette.colors.map((color, index) => (
              <div
                key={index}
                className={styles.colorSwatch}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className={`${styles.name} ${selected === palette.id ? styles.selected : ''}`}>
            {palette.name}
          </p>
        </div>
      ))}
    </div>
  );
}
