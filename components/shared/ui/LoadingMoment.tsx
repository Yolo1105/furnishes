'use client';

import React, { useState, useEffect } from 'react';
import styles from './LoadingMoment.module.css';

interface LoadingMomentProps {
  stages: string[];
  duration?: number; // Total duration in ms
  onComplete?: () => void;
}

export default function LoadingMoment({ 
  stages, 
  duration = 1200,
  onComplete 
}: LoadingMomentProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const stageDuration = duration / stages.length;

  useEffect(() => {
    if (currentStage < stages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStage(currentStage + 1);
      }, stageDuration);
      return () => clearTimeout(timer);
    } else if (currentStage === stages.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, stageDuration);
      return () => clearTimeout(timer);
    }
  }, [currentStage, stages.length, stageDuration, onComplete]);

  return (
    <div className={styles.loadingMoment}>
      <div className={styles.spinner}>
        <div className={styles.spinnerDot}></div>
        <div className={styles.spinnerDot}></div>
        <div className={styles.spinnerDot}></div>
      </div>
      <div className={styles.loadingText}>{stages[currentStage]}</div>
    </div>
  );
}
