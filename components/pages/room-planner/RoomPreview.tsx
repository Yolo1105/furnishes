'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './RoomPreview.module.css';
import type { RoomConfig } from '@/types/project';

interface RoomPreviewProps {
  roomConfig: RoomConfig | null;
  onOpeningChange?: (openings: RoomConfig['openings']) => void;
}

export default function RoomPreview({ roomConfig, onOpeningChange }: RoomPreviewProps) {
  const [placementMode, setPlacementMode] = useState<'door' | 'window' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Handle Esc key to cancel placement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && placementMode) {
        setPlacementMode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placementMode]);

  // Always show a preview - use default dimensions if not configured
  const width = roomConfig?.dimensions.width || 12;
  const length = roomConfig?.dimensions.length || 12;
  const scale = 8; // pixels per foot for better visibility
  const svgWidth = Math.max(200, width * scale);
  const svgHeight = Math.max(200, length * scale);
  const gridSize = 2; // 2 feet per grid square

  const doorCount = roomConfig?.openings.filter(o => o.type === 'door').length || 0;
  const windowCount = roomConfig?.openings.filter(o => o.type === 'window').length || 0;

  const handleAddDoor = () => {
    if (!roomConfig) return;
    setPlacementMode('door');
  };

  const handleAddWindow = () => {
    if (!roomConfig) return;
    setPlacementMode('window');
  };

  const handleWallClick = (e: React.MouseEvent<SVGRectElement>, wall: 'top' | 'bottom' | 'left' | 'right') => {
    if (!placementMode || !roomConfig || !onOpeningChange || !svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - svgRect.left) / svgRect.width) * svgWidth;
    const clickY = ((e.clientY - svgRect.top) / svgRect.height) * svgHeight;
    
    // Calculate position based on which wall was clicked
    let position = { x: 0, y: 0 };
    if (wall === 'top') {
      position = { x: clickX / scale, y: 0 };
    } else if (wall === 'bottom') {
      position = { x: clickX / scale, y: roomConfig.dimensions.length };
    } else if (wall === 'left') {
      position = { x: 0, y: clickY / scale };
    } else {
      position = { x: roomConfig.dimensions.width, y: clickY / scale };
    }

    if (placementMode === 'door') {
      const newOpening: RoomConfig['openings'][0] = {
        id: `door-${Date.now()}`,
        type: 'door',
        position,
        swing: 'inward'
      };
      onOpeningChange([...roomConfig.openings, newOpening]);
    } else {
      const newOpening: RoomConfig['openings'][0] = {
        id: `window-${Date.now()}`,
        type: 'window',
        position,
        size: 'standard'
      };
      onOpeningChange([...roomConfig.openings, newOpening]);
    }
    setPlacementMode(null);
  };

  return (
    <div className={styles.roomPreview}>
      <div className={styles.previewHeader}>
        <div>
          <h3 className={styles.previewTitle}>Preview</h3>
          <p className={styles.previewSubtitle}>
              {placementMode 
              ? `Click a wall to place ${placementMode === 'door' ? 'door' : 'window'}. Press Esc to cancel.`
              : roomConfig 
                ? 'Click &quot;Add door&quot; or &quot;Add window&quot; to start placement'
                : 'Select a preset or enter dimensions. Preview updates instantly.'}
          </p>
        </div>
        <div className={styles.addButtons}>
          <button
            className={`${styles.addButton} ${placementMode === 'door' ? styles.active : ''}`}
            onClick={handleAddDoor}
            disabled={!roomConfig}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg>
            Add door
          </button>
          <button
            className={`${styles.addButton} ${placementMode === 'window' ? styles.active : ''}`}
            onClick={handleAddWindow}
            disabled={!roomConfig}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 4v16M18 4v16" />
            </svg>
            Add window
          </button>
          {placementMode && (
            <button
              className={styles.cancelButton}
              onClick={() => setPlacementMode(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className={styles.canvasContainer}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.canvas}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width={gridSize * scale} height={gridSize * scale} patternUnits="userSpaceOnUse">
              <path d={`M ${gridSize * scale} 0 L 0 0 0 ${gridSize * scale}`} fill="none" stroke="#f0f0f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

          {/* Dimension rulers */}
          {/* Top ruler */}
          <line x1="0" y1="0" x2={svgWidth} y2="0" stroke="#e0e0e0" strokeWidth="2" />
          {Array.from({ length: Math.floor(width / gridSize) + 1 }).map((_, i) => {
            const x = i * gridSize * scale;
            return (
              <g key={`ruler-top-${i}`}>
                <line x1={x} y1="0" x2={x} y2="8" stroke="#e0e0e0" strokeWidth="1" />
                {i % 2 === 0 && (
                  <text x={x} y="6" fontSize="8" fill="#999" textAnchor="middle">{i * gridSize}&apos;</text>
                )}
              </g>
            );
          })}

          {/* Left ruler */}
          <line x1="0" y1="0" x2="0" y2={svgHeight} stroke="#e0e0e0" strokeWidth="2" />
          {Array.from({ length: Math.floor(length / gridSize) + 1 }).map((_, i) => {
            const y = i * gridSize * scale;
            return (
              <g key={`ruler-left-${i}`}>
                <line x1="0" y1={y} x2="8" y2={y} stroke="#e0e0e0" strokeWidth="1" />
                {i % 2 === 0 && (
                  <text x="6" y={y + 4} fontSize="8" fill="#999" textAnchor="end">{i * gridSize}&apos;</text>
                )}
              </g>
            );
          })}

          {/* Room outline */}
          <rect
            x="0"
            y="0"
            width={svgWidth}
            height={svgHeight}
            fill="rgba(255, 255, 255, 0.8)"
            stroke="#2c2c2c"
            strokeWidth="2"
          />

          {/* Wall labels */}
          <text x={svgWidth / 2} y="20" fontSize="10" fill="#666" textAnchor="middle" fontWeight="600">Top</text>
          <text x={svgWidth / 2} y={svgHeight - 8} fontSize="10" fill="#666" textAnchor="middle" fontWeight="600">Bottom</text>
          <text x="20" y={svgHeight / 2} fontSize="10" fill="#666" textAnchor="middle" fontWeight="600" transform={`rotate(-90 20 ${svgHeight / 2})`}>Left</text>
          <text x={svgWidth - 8} y={svgHeight / 2} fontSize="10" fill="#666" textAnchor="middle" fontWeight="600" transform={`rotate(-90 ${svgWidth - 8} ${svgHeight / 2})`}>Right</text>

          {/* Openings */}
          {roomConfig?.openings.map((opening) => {
            const isDoor = opening.type === 'door';
            const size = isDoor ? 3 : 4; // feet
            const x = opening.position.x * scale;
            const y = opening.position.y * scale;

            // Determine which wall the opening is on
            const isOnTop = y < 5;
            const isOnBottom = y > roomConfig.dimensions.length * scale - 5;
            const isOnLeft = x < 5;
            const isOnRight = x > roomConfig.dimensions.width * scale - 5;

            return (
              <g key={opening.id}>
                {isDoor ? (
                  <>
                    {isOnTop && (
                      <rect
                        x={x - (size * scale) / 2}
                        y={0}
                        width={size * scale}
                        height={8}
                        fill="#8B7355"
                        stroke="#4A3F38"
                        strokeWidth="1"
                        rx="2"
                      />
                    )}
                    {isOnBottom && (
                      <rect
                        x={x - (size * scale) / 2}
                        y={svgHeight - 8}
                        width={size * scale}
                        height={8}
                        fill="#8B7355"
                        stroke="#4A3F38"
                        strokeWidth="1"
                        rx="2"
                      />
                    )}
                    {isOnLeft && (
                      <rect
                        x={0}
                        y={y - (size * scale) / 2}
                        width={8}
                        height={size * scale}
                        fill="#8B7355"
                        stroke="#4A3F38"
                        strokeWidth="1"
                        rx="2"
                      />
                    )}
                    {isOnRight && (
                      <rect
                        x={svgWidth - 8}
                        y={y - (size * scale) / 2}
                        width={8}
                        height={size * scale}
                        fill="#8B7355"
                        stroke="#4A3F38"
                        strokeWidth="1"
                        rx="2"
                      />
                    )}
                    {opening.swing === 'inward' && (
                      <path
                        d={`M ${x + (size * scale) / 2} ${y} A ${size * scale} ${size * scale} 0 0 1 ${x + (size * scale) / 2} ${y + size * scale}`}
                        fill="none"
                        stroke="#E55E00"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        opacity="0.6"
                      />
                    )}
                    <text x={x} y={y + 4} fontSize="8" fill="white" textAnchor="middle" fontWeight="600">D</text>
                  </>
                ) : (
                  <>
                    {isOnTop && (
                      <rect
                        x={x - (size * scale) / 2}
                        y={0}
                        width={size * scale}
                        height={12}
                        fill="#E0F2F1"
                        stroke="#4A90E2"
                        strokeWidth="2"
                        opacity="0.8"
                        rx="2"
                      />
                    )}
                    {isOnBottom && (
                      <rect
                        x={x - (size * scale) / 2}
                        y={svgHeight - 12}
                        width={size * scale}
                        height={12}
                        fill="#E0F2F1"
                        stroke="#4A90E2"
                        strokeWidth="2"
                        opacity="0.8"
                        rx="2"
                      />
                    )}
                    {isOnLeft && (
                      <rect
                        x={0}
                        y={y - (size * scale) / 2}
                        width={12}
                        height={size * scale}
                        fill="#E0F2F1"
                        stroke="#4A90E2"
                        strokeWidth="2"
                        opacity="0.8"
                        rx="2"
                      />
                    )}
                    {isOnRight && (
                      <rect
                        x={svgWidth - 12}
                        y={y - (size * scale) / 2}
                        width={12}
                        height={size * scale}
                        fill="#E0F2F1"
                        stroke="#4A90E2"
                        strokeWidth="2"
                        opacity="0.8"
                        rx="2"
                      />
                    )}
                    <text x={x} y={y + 4} fontSize="8" fill="#4A90E2" textAnchor="middle" fontWeight="600">W</text>
                  </>
                )}
              </g>
            );
          })}

          {/* Placement mode indicator */}
          {placementMode && (
            <>
              <rect
                x="0"
                y="0"
                width={svgWidth}
                height={svgHeight}
                fill="rgba(229, 94, 0, 0.05)"
                stroke="#E55E00"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
              <text x={svgWidth / 2} y={svgHeight / 2} fontSize="14" fill="#E55E00" textAnchor="middle" fontWeight="600">
                Click a wall to place {placementMode}
              </text>
              <text x={svgWidth / 2} y={svgHeight / 2 + 20} fontSize="10" fill="#999" textAnchor="middle">
                Press Esc to cancel
              </text>
            </>
          )}

          {/* Clickable wall areas for placement */}
          {placementMode && (
            <>
              <rect
                x="0"
                y="0"
                width={svgWidth}
                height={30}
                fill="rgba(229, 94, 0, 0.15)"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleWallClick(e, 'top')}
              />
              <rect
                x="0"
                y={svgHeight - 30}
                width={svgWidth}
                height={30}
                fill="rgba(229, 94, 0, 0.15)"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleWallClick(e, 'bottom')}
              />
              <rect
                x="0"
                y="0"
                width={30}
                height={svgHeight}
                fill="rgba(229, 94, 0, 0.15)"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleWallClick(e, 'left')}
              />
              <rect
                x={svgWidth - 30}
                y="0"
                width={30}
                height={svgHeight}
                fill="rgba(229, 94, 0, 0.15)"
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleWallClick(e, 'right')}
              />
            </>
          )}
        </svg>

        {/* Room summary overlay */}
        {(roomConfig || true) && (
          <div className={styles.roomSummary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{width}&apos; × {length}&apos;</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryValue}>{width * length} sq ft</span>
            </div>
            {roomConfig && (
              <div className={styles.summaryRow}>
                <span className={styles.summaryMeta}>
                  Door: {doorCount} {doorCount !== 1 ? 'doors' : 'door'}
                  {windowCount > 0 && `, Window: ${windowCount} ${windowCount !== 1 ? 'windows' : 'window'}`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {roomConfig && (
        <div className={styles.previewFooter}>
          <div className={styles.footerInfo}>
            <span className={styles.footerLabel}>Usable area:</span>
            <span className={styles.footerValue}>{roomConfig.usableArea} sq ft</span>
          </div>
          <div className={styles.footerHint}>
            Clearance checks will run in the next step
          </div>
        </div>
      )}
    </div>
  );
}
