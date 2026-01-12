'use client';

import React, { useState } from 'react';
import type { StylePack } from '@/types/project';
import styles from './StylePackOutput.module.css';

interface StylePackOutputProps {
  stylePack: StylePack;
  onRefine?: (refinement: string) => void;
}

export default function StylePackOutput({ stylePack, onRefine }: StylePackOutputProps) {
  const [evidenceExpanded, setEvidenceExpanded] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleColorClick = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className={styles.stylePackOutput}>
      <div className={styles.header}>
        <h2 className={styles.title}>YOUR STYLE PACK</h2>
        <button className={styles.editButton}>Edit</button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>DIRECTION</h3>
          <div className={styles.directionName}>{stylePack.direction}</div>
          <div className={styles.directionDescription}>
            Clean lines with warm, natural comfort
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>PALETTE</h3>
          <div className={styles.paletteGrid}>
            {stylePack.palette.map((color, index) => {
              const labels = ['Warm White', 'Soft Beige', 'Charcoal Accent', 'Muted Green'];
              return (
                <div key={index} className={styles.colorChip}>
                  <button
                    className={styles.colorSquare}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                    title={`Click to copy ${color}`}
                  >
                    {copiedColor === color && (
                      <div className={styles.copiedToast}>Copied!</div>
                    )}
                  </button>
                  <div className={styles.colorLabel}>{labels[index] || `Color ${index + 1}`}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>MATERIALS</h3>
          <div className={styles.materials}>
            {stylePack.materials.map((material, index) => (
              <span key={index}>
                {material}
                {index < stylePack.materials.length - 1 && ' • '}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>RULES</h3>
          <div className={styles.rules}>
            <div className={styles.keepRules}>
              <span className={styles.ruleIcon}>Yes</span>
              <span>Keep: {stylePack.keepRules.join(', ')}</span>
            </div>
            <div className={styles.avoidRules}>
              <span className={styles.ruleIcon}>No</span>
              <span>Avoid: {stylePack.avoidRules.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className={styles.evidenceSection}>
          <button
            className={styles.evidenceToggle}
            onClick={() => setEvidenceExpanded(!evidenceExpanded)}
          >
            <span>{evidenceExpanded ? '▼' : '▶'}</span>
            <span>Why this works for you</span>
          </button>
          {evidenceExpanded && (
            <div className={styles.evidenceContent}>
              <ul className={styles.evidenceList}>
                {stylePack.evidence.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {onRefine && (
        <div className={styles.refinementSection}>
          <div className={styles.refinementTitle}>Not quite right?</div>
          <div className={styles.refinementButtons}>
            <button onClick={() => onRefine('warmer')}>Try warmer</button>
            <button onClick={() => onRefine('cooler')}>Try cooler</button>
            <button onClick={() => onRefine('more-contrast')}>More contrast</button>
            <button onClick={() => onRefine('less-contrast')}>Less contrast</button>
            <button onClick={() => onRefine('regenerate')}>Regenerate entirely</button>
          </div>
        </div>
      )}
    </div>
  );
}
