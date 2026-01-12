import React from 'react';
import { FurnitureItem } from '@/types/furniture';
import styles from '../sections/CenterPanel.module.css';

interface DetailInfoPopupProps {
  selectedFurniture: FurnitureItem | null | undefined;
  transformMode: 'translate' | 'rotate';
  isTransformActive: boolean;
  showBoundingBoxes: boolean;
  hasCollision: boolean;
  collisions: {[key: string]: string[]};
}

export default function DetailInfoPopup({ 
  selectedFurniture, 
  transformMode, 
  isTransformActive, 
  showBoundingBoxes,
  hasCollision,
  collisions
}: DetailInfoPopupProps) {
  if (!selectedFurniture) return null;

  // Get collision details for selected furniture
  const selectedCollisions = collisions[selectedFurniture.id] || [];
  const furnitureCollisions = selectedCollisions.filter(collision => 
    !collision.includes('-wall')
  );
  const wallCollisions = selectedCollisions.filter(collision => 
    collision.includes('-wall')
  );

  return (
    <div className={styles.detailInfoPopup}>
      <div className={styles.detailInfoHeader}>
        <svg className={styles.detailInfoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <line x1="6" y1="8" x2="18" y2="8"/>
          <line x1="6" y1="12" x2="18" y2="12"/>
          <line x1="6" y1="16" x2="14" y2="16"/>
        </svg>
        <span className={styles.detailInfoTitle}>Furniture Details</span>
      </div>
      
      <div className={styles.detailInfoContent}>
        <div className={styles.detailInfoRow}>
          <span className={styles.detailInfoLabel}>Selected:</span>
          <span className={styles.detailInfoValue}>{selectedFurniture.type}-{selectedFurniture.id}</span>
        </div>
        
        <div className={styles.detailInfoRow}>
          <span className={styles.detailInfoLabel}>Position:</span>
          <span className={styles.detailInfoValue}>
            X: {selectedFurniture.position?.[0]?.toFixed(2) || '0.00'}, 
            Y: {selectedFurniture.position?.[1]?.toFixed(2) || '0.00'}, 
            Z: {selectedFurniture.position?.[2]?.toFixed(2) || '0.00'}
          </span>
        </div>
        
        <div className={styles.detailInfoRow}>
          <span className={styles.detailInfoLabel}>Rotation:</span>
          <span className={styles.detailInfoValue}>
            X: {selectedFurniture.rotation?.[0]?.toFixed(2) || '0.00'}, 
            Y: {selectedFurniture.rotation?.[1]?.toFixed(2) || '0.00'}, 
            Z: {selectedFurniture.rotation?.[2]?.toFixed(2) || '0.00'}
          </span>
        </div>
        
        <div className={styles.detailInfoRow}>
          <span className={styles.detailInfoLabel}>Collision:</span>
          <span className={`${styles.detailInfoValue} ${hasCollision ? styles.collisionStatus : ''}`}>
            {hasCollision ? 'Yes' : 'No'}
          </span>
        </div>
        
        {/* Show collision details if there are any */}
        {hasCollision && (
          <>
            {wallCollisions.length > 0 && (
              <div className={styles.detailInfoRow}>
                <span className={styles.detailInfoLabel}>Wall Collisions:</span>
                <span className={`${styles.detailInfoValue} ${styles.collisionStatus}`}>
                  {wallCollisions.map(wall => wall.replace('-wall', '')).join(', ')}
                </span>
              </div>
            )}
            
            {furnitureCollisions.length > 0 && (
              <div className={styles.detailInfoRow}>
                <span className={styles.detailInfoLabel}>Furniture Collisions:</span>
                <span className={`${styles.detailInfoValue} ${styles.collisionStatus}`}>
                  {furnitureCollisions.length} item(s)
                </span>
              </div>
            )}
          </>
        )}
        
        <div className={styles.detailInfoRow}>
          <span className={styles.detailInfoLabel}>Transform Mode:</span>
          <span className={styles.detailInfoValue}>
            {isTransformActive ? transformMode : 'None'}
          </span>
        </div>
        
        <div className={styles.detailInfoRow}>
          <span className={styles.detailInfoLabel}>Bounding Boxes:</span>
          <span className={styles.detailInfoValue}>
            {showBoundingBoxes ? 'On' : 'Off'}
          </span>
        </div>
      </div>
    </div>
  );
}
