'use client';

import React from 'react';
import styles from './GuardrailsCard.module.css';

export interface BudgetGuardrails {
  maxSharePerCategoryPct?: number;
  minDecorLightingPct?: number;
  preferEvenQuality?: boolean;
}

interface GuardrailsCardProps {
  value: BudgetGuardrails;
  onChange: (value: BudgetGuardrails) => void;
}

export default function GuardrailsCard({ value, onChange }: GuardrailsCardProps) {
  const update = (partial: Partial<BudgetGuardrails>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <div className={styles.card}>
      <div className={styles.guardrailRow}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={Boolean(value.maxSharePerCategoryPct)}
          onChange={(e) =>
            update({
              maxSharePerCategoryPct: e.target.checked ? value.maxSharePerCategoryPct ?? 60 : undefined
            })
          }
        />
        <span className={styles.label}>Cap any single category at</span>
        <input
          type="number"
          min={10}
          max={90}
          step={5}
          className={styles.numberInput}
          value={value.maxSharePerCategoryPct ?? 60}
          onChange={(e) => update({ maxSharePerCategoryPct: Number(e.target.value) })}
          disabled={!value.maxSharePerCategoryPct}
        />
        <span>%</span>
      </div>
      <p className={styles.helper}>Keeps one splurge from starving the rest of the room.</p>

      <div className={styles.guardrailRow}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={Boolean(value.minDecorLightingPct)}
          onChange={(e) =>
            update({
              minDecorLightingPct: e.target.checked ? value.minDecorLightingPct ?? 10 : undefined
            })
          }
        />
        <span className={styles.label}>Always reserve at least</span>
        <input
          type="number"
          min={5}
          max={25}
          step={5}
          className={styles.numberInput}
          value={value.minDecorLightingPct ?? 10}
          onChange={(e) => update({ minDecorLightingPct: Number(e.target.value) })}
          disabled={!value.minDecorLightingPct}
        />
        <span>% for lighting & decor</span>
      </div>

      <label className={styles.guardrailRow}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={Boolean(value.preferEvenQuality)}
          onChange={(e) => update({ preferEvenQuality: e.target.checked })}
        />
        <span className={styles.label}>Keep overall quality consistent (no single showpiece)</span>
      </label>
    </div>
  );
}
