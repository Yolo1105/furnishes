'use client';

import React from 'react';
import Image from 'next/image';
import styles from './VisualTasteGrid.module.css';

interface VisualOption {
  id: string;
  image: string;
  label: string;
  description: string;
}

interface VisualTasteGridProps {
  selectedImages: string[];
  onImageToggle: (imageId: string) => void;
}

const visualOptions: VisualOption[] = [
  {
    id: 'warm-minimal',
    image: '/images/h-modern-living-room.jpg',
    label: 'Warm Minimal',
    description: 'Light wood, clean lines'
  },
  {
    id: 'soft-modern',
    image: '/images/h-grey-sofa.jpg',
    label: 'Soft Modern',
    description: 'Neutral tones, comfort'
  },
  {
    id: 'natural-calm',
    image: '/images/h-white-sofa.jpg',
    label: 'Natural Calm',
    description: 'Organic textures'
  },
  {
    id: 'studio-clean',
    image: '/images/design1.jpg',
    label: 'Studio Clean',
    description: 'Minimal, functional'
  },
  {
    id: 'cozy-neutral',
    image: '/images/h-yellow-sofa.jpg',
    label: 'Cozy Neutral',
    description: 'Warm, inviting'
  },
  {
    id: 'light-oak',
    image: '/images/hero-modern-room.jpg',
    label: 'Light Oak',
    description: 'Natural wood tones'
  },
  {
    id: 'textured-linen',
    image: '/images/h-orange-sofa.jpg',
    label: 'Textured Linen',
    description: 'Soft materials'
  },
  {
    id: 'charcoal-accent',
    image: '/images/h-black-sofa.jpg',
    label: 'Charcoal Accent',
    description: 'Bold contrast'
  }
];

export default function VisualTasteGrid({
  selectedImages,
  onImageToggle
}: VisualTasteGridProps) {
  const isSelected = (imageId: string) => selectedImages.includes(imageId);
  const canSelect = selectedImages.length < 3;

  const handleImageClick = (imageId: string) => {
    if (isSelected(imageId)) {
      onImageToggle(imageId);
    } else if (canSelect) {
      onImageToggle(imageId);
    }
  };

  return (
    <div className={styles.visualTasteGrid}>
      <div className={styles.header}>
        <h3 className={styles.title}>Pick 3 that speak to you</h3>
        <p className={styles.subtitle}>Don&apos;t overthink it—first instinct is best</p>
      </div>

      <div className={styles.grid}>
        {visualOptions.map((option) => {
          const selected = isSelected(option.id);
          const disabled = !selected && !canSelect;

          return (
            <button
              key={option.id}
              className={`${styles.imageCard} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
              onClick={() => handleImageClick(option.id)}
              disabled={disabled}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={option.image}
                  alt={option.label}
                  fill
                  className={styles.image}
                  style={{ objectFit: 'cover' }}
                />
                {selected && (
                  <div className={styles.checkmarkBadge}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardLabel}>{option.label}</div>
                <div className={styles.cardDescription}>{option.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.progress}>
        <span className={styles.progressText}>
          Selected: {selectedImages.length} of 3
        </span>
        <div className={styles.progressDots}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${styles.dot} ${i < selectedImages.length ? styles.filled : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
