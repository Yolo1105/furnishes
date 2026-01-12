'use client';

import React from 'react';
import type { StylePack } from '@/types/project';
import StyleDNASliders, { type StyleDNAValues } from './StyleDNASliders';
import styles from './StyleSummaryPanel.module.css';

interface StyleSummaryPanelProps {
  stylePack: StylePack | null;
  roomName: string;
  onRoomNameChange: (name: string) => void;
  mode: 'known' | 'guided';
  primaryStyle?: string;
  accents?: string[];
  styleDNA?: StyleDNAValues;
  onStyleDNAChange?: (values: StyleDNAValues) => void;
  mustKeep?: string[];
  hardNos?: string[];
  onMustKeepChange?: (items: string[]) => void;
  onHardNosChange?: (items: string[]) => void;
}

export default function StyleSummaryPanel({
  stylePack,
  roomName,
  onRoomNameChange,
  mode,
  primaryStyle,
  accents,
  styleDNA,
  onStyleDNAChange,
  mustKeep = [],
  hardNos = [],
  onMustKeepChange,
  onHardNosChange
}: StyleSummaryPanelProps) {
  const defaultDNA: StyleDNAValues = styleDNA || {
    classicModern: 30,
    minimalLayered: 40,
    neutralColorful: 20,
    coolWarm: 50,
    sleekNatural: 50,
    calmEnergetic: 30
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.panelSection}>
        <div className={styles.roomHeader}>
          <div>
            <p className={styles.sectionLabel}>ROOM PROFILE</p>
            <input
              className={styles.roomNameInput}
              value={roomName}
              onChange={(e) => onRoomNameChange(e.target.value)}
              placeholder="Living room"
              aria-label="Room name"
            />
          </div>
          <div className={styles.modeBadge}>
            {mode === 'known' ? 'I KNOW MY STYLE' : 'HELP ME FIND IT'}
          </div>
        </div>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>PRIMARY STYLE</p>
        <p className={styles.primaryStyleValue}>
          {primaryStyle || 'Still picking'}
        </p>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>ACCENTS</p>
        <p className={styles.accentsHint}>
          {accents && accents.length > 0 
            ? accents.join(', ')
            : 'Add an accent if you want a mix.'}
        </p>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>STYLE SNAPSHOT</p>
        <p className={styles.snapshotText}>
          Tell us how you want this space to feel and we'll shape the materials, palette, and guardrails for you.
        </p>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>STYLE DNA SLIDERS</p>
        {onStyleDNAChange ? (
          <StyleDNASliders values={defaultDNA} onChange={onStyleDNAChange} />
        ) : (
          <StyleDNASliders values={defaultDNA} onChange={() => {}} />
        )}
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>EXAMPLES</p>
        <div className={styles.examplesGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.examplePlaceholder}>
              {/* Placeholder for example images */}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>GUARDRAILS</p>
        <div className={styles.guardrailsList}>
          <div className={styles.guardrailItem}>
            <span className={styles.guardrailLabel}>Must keep</span>
            {onMustKeepChange ? (
              <button
                className={styles.guardrailButton}
                onClick={() => {
                  const item = prompt('What must be kept?');
                  if (item) onMustKeepChange([...mustKeep, item]);
                }}
              >
                {mustKeep.length > 0 ? mustKeep.join(', ') : 'None yet'}
              </button>
            ) : (
              <span className={styles.guardrailValue}>
                {mustKeep.length > 0 ? mustKeep.join(', ') : 'None yet'}
              </span>
            )}
          </div>
          <div className={styles.guardrailItem}>
            <span className={styles.guardrailLabel}>Hard no's</span>
            {onHardNosChange ? (
              <button
                className={styles.guardrailButton}
                onClick={() => {
                  const item = prompt('What should be avoided?');
                  if (item) onHardNosChange([...hardNos, item]);
                }}
              >
                {hardNos.length > 0 ? hardNos.join(', ') : 'Tell us what to avoid'}
              </button>
            ) : (
              <span className={styles.guardrailValue}>
                {hardNos.length > 0 ? hardNos.join(', ') : 'Tell us what to avoid'}
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
