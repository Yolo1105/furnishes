'use client';

import React from 'react';
import styles from './PlaygroundLayout.module.css';
import LeftSidebar from './LeftSidebar';
import CenterPanel from './CenterPanel';
import CustomizationPanel from './CustomizationPanel';

export default function PlaygroundLayout() {
  return (
    <div className={styles.playgroundContainer}>
      <LeftSidebar />
      <CenterPanel />
      <CustomizationPanel />
    </div>
  );
}
