'use client';

import React from 'react';
import styles from './StyleDNASliders.module.css';

export interface StyleDNAValues {
  classicModern: number; // 0 = Classic, 100 = Modern
  minimalLayered: number; // 0 = Minimal, 100 = Layered
  neutralColorful: number; // 0 = Neutral, 100 = Colorful
  coolWarm: number; // 0 = Cool, 100 = Warm
  sleekNatural: number; // 0 = Sleek, 100 = Natural
  calmEnergetic: number; // 0 = Calm, 100 = Energetic
}

interface StyleDNASlidersProps {
  values: StyleDNAValues;
  onChange: (values: StyleDNAValues) => void;
}

const sliders = [
  { key: 'classicModern' as keyof StyleDNAValues, left: 'Classic', right: 'Modern' },
  { key: 'minimalLayered' as keyof StyleDNAValues, left: 'Minimal', right: 'Layered' },
  { key: 'neutralColorful' as keyof StyleDNAValues, left: 'Neutral', right: 'Colorful' },
  { key: 'coolWarm' as keyof StyleDNAValues, left: 'Cool', right: 'Warm' },
  { key: 'sleekNatural' as keyof StyleDNAValues, left: 'Sleek', right: 'Natural' },
  { key: 'calmEnergetic' as keyof StyleDNAValues, left: 'Calm', right: 'Energetic' }
];

export default function StyleDNASliders({ values, onChange }: StyleDNASlidersProps) {
  const handleSliderChange = (key: keyof StyleDNAValues, value: number) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className={styles.slidersContainer}>
      {sliders.map((slider) => {
        const value = values[slider.key];
        return (
          <div key={slider.key} className={styles.sliderGroup}>
            <div className={styles.sliderLabels}>
              <span className={styles.sliderLabel}>{slider.left}</span>
              <span className={styles.sliderLabel}>{slider.right}</span>
            </div>
            <div className={styles.sliderWrapper}>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
