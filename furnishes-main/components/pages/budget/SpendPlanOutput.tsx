'use client';

import React, { useState } from 'react';
import type { BudgetPlan } from '@/types/project';
import styles from './SpendPlanOutput.module.css';

interface SpendPlanOutputProps {
  budgetPlan: BudgetPlan;
  onWhatIf?: (adjustment: number) => void;
}

const categoryLabels: Record<string, string> = {
  seating: 'Seating',
  storage: 'Storage',
  lighting: 'Lighting',
  bed_or_desk: 'Bed/Desk',
  rug_decor: 'Rug & Decor',
  buffer: 'Buffer'
};

const categoryDescriptions: Record<string, string> = {
  seating: 'Protected—quality pieces that last',
  storage: 'Example: Media console, bookshelf',
  lighting: 'Protected—layered for mood and function',
  bed_or_desk: 'Example: Queen frame, mattress foundation',
  rug_decor: 'Flexible—we\'ll trade here first if needed',
  buffer: 'For unexpected finds or shipping'
};

const categoryExamples: Record<string, string> = {
  seating: 'Example: Mid-range sofa, accent chair',
  lighting: 'Example: Floor lamp, 2 table lamps, dimmer',
  storage: 'Example: Media console, bookshelf',
  bed_or_desk: 'Example: Queen frame, mattress foundation',
  rug_decor: 'Example: 8x10 rug, throw pillows, wall art',
  buffer: 'For unexpected finds or shipping'
};

export default function SpendPlanOutput({ budgetPlan, onWhatIf }: SpendPlanOutputProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const totalAllocated = Object.values(budgetPlan.allocations).reduce((sum, val) => sum + val, 0);
  const maxAllocation = Math.max(...Object.values(budgetPlan.allocations));

  const getStatusColor = () => {
    switch (budgetPlan.confidence) {
      case 'on_track':
        return '#4a7c59';
      case 'over_budget':
        return '#c44';
      case 'under_budget':
        return '#4a90e2';
      default:
        return '#666';
    }
  };

  const getStatusLabel = () => {
    switch (budgetPlan.confidence) {
      case 'on_track':
        return 'On track';
      case 'over_budget':
        return 'Over budget';
      case 'under_budget':
        return 'Under budget';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={styles.spendPlanOutput}>
      <div className={styles.header}>
        <h2 className={styles.title}>YOUR SPEND PLAN</h2>
        <button className={styles.editButton}>Edit</button>
      </div>

      <div className={styles.content}>
        <div className={styles.summary}>
          <div className={styles.targetRow}>
            <span className={styles.targetLabel}>TARGET:</span>
            <span className={styles.targetAmount}>${budgetPlan.total.toLocaleString()}</span>
            <span className={styles.statusBadge} style={{ color: getStatusColor() }}>
              ● {getStatusLabel()}
            </span>
          </div>
        </div>

        <div className={styles.allocationSection}>
          <div className={styles.allocationBar}>
            <div 
              className={styles.allocationFill}
              style={{ width: `${(totalAllocated / budgetPlan.total) * 100}%` }}
            />
            <span className={styles.allocationTotal}>
              ${totalAllocated.toLocaleString()}
            </span>
          </div>

          <div className={styles.categories}>
            {Object.entries(budgetPlan.allocations).map(([key, amount]) => {
              const percentage = (amount / budgetPlan.total) * 100;
              const barWidth = (amount / maxAllocation) * 100;
              const isProtected = key === 'seating' || key === 'lighting'; // Simplified logic

              return (
                <div key={key} className={styles.categoryRow}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryInfo}>
                      {isProtected && <span className={styles.protectedStar}>★</span>}
                      <span className={styles.categoryName}>{categoryLabels[key]}</span>
                      <span className={styles.categoryAmount}>${amount.toLocaleString()}</span>
                      <span className={styles.categoryPercent}>{Math.round(percentage)}%</span>
                    </div>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryBarFill}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className={styles.categoryDescription}>
                    {isProtected ? categoryDescriptions[key] : categoryExamples[key]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.tradeoffSection}>
          <div className={styles.tradeoffIcon}>Note:</div>
          <div className={styles.tradeoffText}>{budgetPlan.tradeoffStatement}</div>
        </div>
      </div>

      {onWhatIf && (
        <div className={styles.whatIfSection}>
          <div className={styles.whatIfTitle}>What would change?</div>
          <div className={styles.whatIfButtons}>
            <button onClick={() => onWhatIf(2000)}>+$2,000</button>
            <button onClick={() => onWhatIf(-2000)}>-$2,000</button>
          </div>
          <div className={styles.whatIfSubtext}>See how allocations shift</div>
        </div>
      )}
    </div>
  );
}
