'use client';

import React, { useState, useEffect } from 'react';
import PresetButtons from './PresetButtons';
import styles from './RoomSetupPanel.module.css';
import type { RoomConfig } from '@/types/project';

interface RoomSetupPanelProps {
  roomConfig: RoomConfig | null;
  onConfigChange: (config: RoomConfig) => void;
}

export default function RoomSetupPanel({
  roomConfig,
  onConfigChange
}: RoomSetupPanelProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    roomConfig ? 'standard' : null
  );
  const [width, setWidth] = useState(roomConfig?.dimensions.width || 12);
  const [length, setLength] = useState(roomConfig?.dimensions.length || 12);
  const [ceiling, setCeiling] = useState(roomConfig?.dimensions.ceiling || 9);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openings, setOpenings] = useState(roomConfig?.openings || []);

  // Initialize with default config if none exists
  useEffect(() => {
    if (!roomConfig) {
      const defaultConfig: RoomConfig = {
        dimensions: { width: 12, length: 12, ceiling: 9 },
        openings: [],
        usableArea: 144
      };
      onConfigChange(defaultConfig);
    }
  }, [roomConfig, onConfigChange]);

  const handlePresetSelect = (preset: { id: string; dimensions: { width: number; length: number; ceiling: number } }) => {
    setSelectedPresetId(preset.id);
    setWidth(preset.dimensions.width);
    setLength(preset.dimensions.length);
    setCeiling(preset.dimensions.ceiling);
    updateConfig(preset.dimensions.width, preset.dimensions.length, preset.dimensions.ceiling, openings);
  };

  const updateConfig = (w: number, l: number, c: number, ops: typeof openings) => {
    const usableArea = (w * l) - (ops.length * 5); // Simplified calculation
    const config: RoomConfig = {
      dimensions: { width: w, length: l, ceiling: c },
      openings: ops,
      usableArea
    };
    onConfigChange(config);
  };

  const handleDimensionChange = (dimension: 'width' | 'length' | 'ceiling', value: number) => {
    const clamped = dimension === 'ceiling' 
      ? Math.max(7, Math.min(15, value))
      : Math.max(6, Math.min(30, value));
    
    // Clear preset selection when manually editing
    if (dimension !== 'ceiling') {
      setSelectedPresetId(null);
    }
    
    if (dimension === 'width') {
      setWidth(clamped);
      updateConfig(clamped, length, ceiling, openings);
    } else if (dimension === 'length') {
      setLength(clamped);
      updateConfig(width, clamped, ceiling, openings);
    } else {
      setCeiling(clamped);
      updateConfig(width, length, clamped, openings);
    }
  };

  const handleIncrement = (dimension: 'width' | 'length' | 'ceiling') => {
    const current = dimension === 'width' ? width : dimension === 'length' ? length : ceiling;
    const max = dimension === 'ceiling' ? 15 : 30;
    const step = dimension === 'ceiling' ? 0.5 : 1;
    handleDimensionChange(dimension, Math.min(max, current + step));
  };

  const handleDecrement = (dimension: 'width' | 'length' | 'ceiling') => {
    const current = dimension === 'width' ? width : dimension === 'length' ? length : ceiling;
    const min = dimension === 'ceiling' ? 7 : 6;
    const step = dimension === 'ceiling' ? 0.5 : 1;
    handleDimensionChange(dimension, Math.max(min, current - step));
  };

  const area = width * length;
  const typicalFit = area < 100 ? 'Compact space' : area < 150 ? 'Full bed + desk' : 'Large furniture set';

  return (
    <div className={styles.roomSetupPanel}>
      <PresetButtons 
        selectedPresetId={selectedPresetId}
        onSelect={handlePresetSelect} 
      />

      <div className={styles.dimensionsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Fine-tune dimensions</h3>
          <p className={styles.sectionDescription}>Adjust to match your exact space</p>
        </div>
        
        <div className={styles.dimensionInputs}>
          <div className={styles.dimensionInput}>
            <label className={styles.inputLabel}>Width</label>
            <div className={styles.inputWrapper}>
              <button 
                className={styles.stepperButton}
                onClick={() => handleDecrement('width')}
                aria-label="Decrease width"
              >
                −
              </button>
              <input
                type="number"
                min="6"
                max="30"
                value={width}
                onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 6)}
                className={styles.numberInput}
              />
              <span className={styles.unit}>ft</span>
              <button 
                className={styles.stepperButton}
                onClick={() => handleIncrement('width')}
                aria-label="Increase width"
              >
                +
              </button>
            </div>
            <div className={styles.inputHint}>Min 6 ft, max 30 ft</div>
          </div>

          <div className={styles.dimensionInput}>
            <label className={styles.inputLabel}>Length</label>
            <div className={styles.inputWrapper}>
              <button 
                className={styles.stepperButton}
                onClick={() => handleDecrement('length')}
                aria-label="Decrease length"
              >
                −
              </button>
              <input
                type="number"
                min="6"
                max="30"
                value={length}
                onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 6)}
                className={styles.numberInput}
              />
              <span className={styles.unit}>ft</span>
              <button 
                className={styles.stepperButton}
                onClick={() => handleIncrement('length')}
                aria-label="Increase length"
              >
                +
              </button>
            </div>
            <div className={styles.inputHint}>Min 6 ft, max 30 ft</div>
          </div>
        </div>

        <div className={styles.derivedInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Area:</span>
            <span className={styles.infoValue}>{area} sq ft</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Typical fit:</span>
            <span className={styles.infoValue}>{typicalFit}</span>
          </div>
        </div>

        <div className={styles.advancedSection}>
          <button
            className={styles.advancedToggle}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            <span>Advanced</span>
          </button>
          {showAdvanced && (
            <div className={styles.advancedContent}>
              <div className={styles.dimensionInput}>
                <label className={styles.inputLabel}>Ceiling height</label>
                <div className={styles.inputWrapper}>
                  <button 
                    className={styles.stepperButton}
                    onClick={() => handleDecrement('ceiling')}
                    aria-label="Decrease ceiling"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="7"
                    max="15"
                    step="0.5"
                    value={ceiling}
                    onChange={(e) => handleDimensionChange('ceiling', parseFloat(e.target.value) || 7)}
                    className={styles.numberInput}
                  />
                  <span className={styles.unit}>ft</span>
                  <button 
                    className={styles.stepperButton}
                    onClick={() => handleIncrement('ceiling')}
                    aria-label="Increase ceiling"
                  >
                    +
                  </button>
                </div>
                <div className={styles.inputHint}>Min 7 ft, max 15 ft</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
