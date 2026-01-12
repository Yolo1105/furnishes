'use client';

import React from 'react';
import styles from './BudgetSummaryPanel.module.css';
import type { CategoryPriority, CategorySpendStyle } from './CategoryPriorityEditor';
import type { BudgetGuardrails } from './GuardrailsCard';

interface CategoryAllocation {
  id: string;
  label: string;
  amount: number;
  percent: number;
  priority?: CategoryPriority;
  spendStyle?: CategorySpendStyle;
}

interface BudgetSummaryPanelProps {
  totalBudget: number;
  allocations: CategoryAllocation[];
  strictnessLabel: string;
  modeLabel?: string;
  healthMessage?: string;
  guardrails?: BudgetGuardrails;
  comfortLevel?: 'value' | 'balanced' | 'premium';
}

const spendStyleCopy: Record<CategorySpendStyle, string> = {
  save: 'Save',
  balanced: 'Balanced',
  splurge: 'Splurge'
};

const priorityCopy: Record<CategoryPriority, string> = {
  must_have: 'Must-have',
  important: 'Important',
  nice_to_have: 'Nice-to-have',
  skip: 'Skip'
};

const comfortLevelLabels: Record<'value' | 'balanced' | 'premium', string> = {
  value: 'Value',
  balanced: 'Balanced',
  premium: 'Premium'
};

export default function BudgetSummaryPanel({
  totalBudget,
  allocations,
  strictnessLabel,
  modeLabel,
  healthMessage,
  guardrails,
  comfortLevel
}: BudgetSummaryPanelProps) {
  const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0);

  return (
    <aside className={styles.panel}>
      <div className={styles.panelSection}>
        <div className={styles.roomHeader}>
          <div>
            <p className={styles.sectionLabel}>BUDGET PROFILE</p>
            <p className={styles.budgetTotal}>${totalBudget.toLocaleString()}</p>
          </div>
          <div className={styles.modeBadge}>
            {modeLabel ? 'I KNOW MY BUDGET' : 'SETTING BUDGET'}
          </div>
        </div>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>COMFORT LEVEL</p>
        <p className={styles.comfortLevelValue}>
          {comfortLevel ? comfortLevelLabels[comfortLevel] : 'Balanced'}
        </p>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>STRICTNESS</p>
        <p className={styles.strictnessValue}>{strictnessLabel}</p>
      </div>

      <div className={styles.panelSection}>
        <p className={styles.sectionLabel}>ALLOCATION BREAKDOWN</p>
        <div className={styles.categoryBar}>
          {allocations.map((allocation) => (
            <div
              key={allocation.id}
              className={styles.categorySegment}
              style={{
                flex: allocation.percent,
                background: `rgba(229, 94, 0, ${0.5 + allocation.percent / 200})`
              }}
              title={`${allocation.label} – ${allocation.percent}%`}
            />
          ))}
        </div>
        <div className={styles.allocationsList}>
          {allocations.map((allocation) => (
            <div key={allocation.id} className={styles.allocationRow}>
              <div className={styles.allocationInfo}>
                <span className={styles.allocationLabel}>{allocation.label}</span>
                <span className={styles.allocationAmount}>${allocation.amount.toLocaleString()}</span>
              </div>
              <div className={styles.allocationMeta}>
                <span className={styles.allocationPercent}>{allocation.percent}%</span>
                {allocation.priority && <span className={styles.tag}>{priorityCopy[allocation.priority]}</span>}
                {allocation.spendStyle && <span className={styles.tag}>{spendStyleCopy[allocation.spendStyle]}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {guardrails && (
        <div className={styles.panelSection}>
          <p className={styles.sectionLabel}>GUARDRAILS</p>
          <div className={styles.guardrailsList}>
            {guardrails.maxSharePerCategoryPct && (
              <div className={styles.guardrailItem}>
                <span className={styles.guardrailLabel}>Max per category:</span>
                <span className={styles.guardrailValue}>{guardrails.maxSharePerCategoryPct}%</span>
              </div>
            )}
            {guardrails.minDecorLightingPct && (
              <div className={styles.guardrailItem}>
                <span className={styles.guardrailLabel}>Min decor/lighting:</span>
                <span className={styles.guardrailValue}>{guardrails.minDecorLightingPct}%</span>
              </div>
            )}
            {guardrails.preferEvenQuality && (
              <div className={styles.guardrailItem}>
                <span className={styles.guardrailLabel}>Even quality:</span>
                <span className={styles.guardrailValue}>Enabled</span>
              </div>
            )}
          </div>
        </div>
      )}

      {healthMessage && (
        <div className={styles.panelSection}>
          <p className={styles.healthMessage}>{healthMessage}</p>
        </div>
      )}
    </aside>
  );
}
