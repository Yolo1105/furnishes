'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import styles from './ProgressStepper.module.css';

interface Step {
  id: string;
  label: string;
  path: string;
}

const steps: Step[] = [
  { id: 'style', label: 'Style Pack', path: '/style' },
  { id: 'budget', label: 'Budget', path: '/budget' },
  { id: 'room-setup', label: 'Room Setup', path: '/room-planner' },
  { id: 'kit-placer', label: 'Place Kit', path: '/room-planner' },
  { id: 'health', label: 'Layout Health', path: '/room-planner' },
  { id: 'export', label: 'Export', path: '/report' }
];

export default function ProgressStepper() {
  const router = useRouter();
  const { state } = useProject();

  const getStepStatus = (stepId: string): 'complete' | 'current' | 'upcoming' => {
    const currentIndex = steps.findIndex(s => s.id === state.currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const isStepComplete = (stepId: string): boolean => {
    switch (stepId) {
      case 'style':
        return !!state.stylePack;
      case 'budget':
        return !!state.budgetPlan;
      case 'room-setup':
        return !!state.roomConfig;
      case 'kit-placer':
        return state.placedItems.length > 0;
      case 'health':
        return !!state.layoutHealth;
      default:
        return false;
    }
  };

  const handleStepClick = (step: Step) => {
    const status = getStepStatus(step.id);
    if (status === 'complete' || isStepComplete(step.id)) {
      router.push(step.path);
    }
  };

  const completedCount = steps.filter(s => isStepComplete(s.id)).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className={styles.progressStepper}>
      <h3 className={styles.title}>YOUR PROJECT</h3>
      <div className={styles.steps}>
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const complete = isStepComplete(step.id);
          const clickable = complete || status === 'current';

          return (
            <div
              key={step.id}
              className={`${styles.step} ${styles[status]} ${clickable ? styles.clickable : ''}`}
              onClick={() => clickable && handleStepClick(step)}
            >
              <div className={styles.stepIcon}>
                {complete ? '●' : status === 'current' ? '◐' : '○'}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepLabel}>{step.label}</div>
                {complete && (
                  <div className={styles.stepSummary}>
                    {step.id === 'style' && state.stylePack && state.stylePack.direction}
                    {step.id === 'budget' && state.budgetPlan && `$${state.budgetPlan.total.toLocaleString()}`}
                    {step.id === 'room-setup' && state.roomConfig && `${state.roomConfig.dimensions.width}×${state.roomConfig.dimensions.length}`}
                    {step.id === 'kit-placer' && state.placedItems.length > 0 && `${state.placedItems.length} items`}
                  </div>
                )}
                {!complete && status === 'upcoming' && (
                  <div className={styles.stepSummary}>Not started</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressLabel}>Progress: {Math.round(progress)}%</div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
