'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomSetupPanel from '@/components/pages/room-planner/RoomSetupPanel';
import RoomPreview from '@/components/pages/room-planner/RoomPreview';
import { useProject } from '@/contexts/ProjectContext';
import type { RoomConfig } from '@/types/project';
import styles from './RoomPlannerPage.module.css';

export default function RoomPlannerPage() {
  const router = useRouter();
  const { state, setRoomConfig, setStep } = useProject();
  const [roomConfig, setLocalRoomConfig] = useState<RoomConfig | null>(state.roomConfig);

  const handleConfigChange = (config: RoomConfig) => {
    setLocalRoomConfig(config);
    setRoomConfig(config);
  };

  const handleContinue = () => {
    if (roomConfig && roomConfig.dimensions.width >= 6 && roomConfig.dimensions.length >= 6) {
      setStep('kit-placer');
      // Navigate to kit placer or stay on same page
    }
  };

  const canContinue = roomConfig && roomConfig.dimensions.width >= 6 && roomConfig.dimensions.length >= 6;

  return (
    <div className={styles.roomPlannerPage}>
      <section className={styles.section}>
        <div className={styles.contentLayer}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div>
              <div className={styles.progressChip}>Step 3 of 6</div>
              <h1 className={styles.pageTitle}>Room setup</h1>
              <p className={styles.pageSubtitle}>
                Set dimensions and openings. Preview updates instantly.
              </p>
            </div>
          </div>

          <div className={styles.twoColumnLayout}>
            <div className={styles.leftColumn}>
              <RoomPreview 
                roomConfig={roomConfig}
                onOpeningChange={(openings) => {
                  if (roomConfig) {
                    const updated = { ...roomConfig, openings };
                    handleConfigChange(updated);
                  }
                }}
              />
            </div>
            <div className={styles.rightColumn}>
              <RoomSetupPanel
                roomConfig={roomConfig}
                onConfigChange={handleConfigChange}
              />
            </div>
          </div>

          {/* Primary CTA */}
          <div className={styles.actionBar}>
            <button
              className={styles.backButton}
              onClick={() => router.push('/budget')}
            >
              ← Back
            </button>
            <button
              className={`${styles.continueButton} ${!canContinue ? styles.disabled : ''}`}
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Continue to planner →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
