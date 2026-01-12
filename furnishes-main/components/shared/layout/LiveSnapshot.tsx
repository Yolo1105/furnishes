'use client';

import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import styles from './LiveSnapshot.module.css';

export default function LiveSnapshot() {
  const { state } = useProject();

  return (
    <div className={styles.liveSnapshot}>
      <h3 className={styles.title}>LIVE SNAPSHOT</h3>
      <p className={styles.subtitle}>Updates as you build</p>

      {state.stylePack && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>STYLE PACK</div>
          <div className={styles.sectionContent}>
            <div className={styles.directionName}>{state.stylePack.direction}</div>
            <div className={styles.paletteChips}>
              {state.stylePack.palette.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className={styles.colorChip}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {state.budgetPlan && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>BUDGET</div>
          <div className={styles.sectionContent}>
            <div className={styles.budgetBar}>
              <div
                className={styles.budgetFill}
                style={{
                  width: `${(Object.values(state.budgetPlan.allocations).reduce((a, b) => a + b, 0) / state.budgetPlan.total) * 100}%`
                }}
              />
            </div>
            <div className={styles.budgetText}>
              ${Object.values(state.budgetPlan.allocations).reduce((a, b) => a + b, 0).toLocaleString()} / ${state.budgetPlan.total.toLocaleString()}
            </div>
            <div className={styles.budgetStatus}>
              ● {state.budgetPlan.confidence === 'on_track' ? 'On track' : 'Review needed'}
            </div>
          </div>
        </div>
      )}

      {state.roomConfig && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>ROOM</div>
          <div className={styles.sectionContent}>
            <div className={styles.roomInfo}>
              {state.roomConfig.dimensions.width}' × {state.roomConfig.dimensions.length}'
            </div>
            <div className={styles.roomOpenings}>
              {state.roomConfig.openings.length} opening{state.roomConfig.openings.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {state.placedItems.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>ITEMS</div>
          <div className={styles.sectionContent}>
            <div className={styles.itemsCount}>{state.placedItems.length} items placed</div>
          </div>
        </div>
      )}

      {state.layoutHealth && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>LAYOUT</div>
          <div className={styles.sectionContent}>
            <div className={`${styles.healthStatus} ${styles[state.layoutHealth.overall]}`}>
              ● {state.layoutHealth.overall === 'green' ? 'Green' : state.layoutHealth.overall === 'needs_attention' ? 'Needs attention' : 'Blocked'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
