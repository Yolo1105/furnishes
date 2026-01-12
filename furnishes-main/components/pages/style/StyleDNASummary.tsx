'use client';

import React from 'react';
import type { StyleDNAValues } from './StyleDNASliders';
import styles from './StyleDNASummary.module.css';

interface StyleDNASummaryProps {
  primaryStyle: string | null;
  styleDNA: StyleDNAValues;
  mustKeep: string[];
  hardNos: string[];
}

export default function StyleDNASummary({
  primaryStyle,
  styleDNA,
  mustKeep,
  hardNos
}: StyleDNASummaryProps) {
  if (!primaryStyle) {
    return (
      <div className={styles.summary}>
        <p className={styles.summaryText}>
          Pick a primary style to anchor this room.
        </p>
      </div>
    );
  }

  const calmEnergetic = styleDNA.calmEnergetic;
  const minimalLayered = styleDNA.minimalLayered;

  return (
    <div className={styles.summary}>
      <p className={styles.summaryText}>
        Pick a primary style to anchor this room. We'll keep the room at{' '}
        <strong>{calmEnergetic} / 100</strong> on the calm vs energetic scale and{' '}
        <strong>{minimalLayered} / 100</strong> on minimal vs layered.{' '}
        {hardNos.length > 0 ? (
          <>
            Hard no's: <strong>{hardNos.join(', ')}</strong>.
          </>
        ) : (
          <>Hard no's: <strong>None yet</strong>.</>
        )}
      </p>
    </div>
  );
}
