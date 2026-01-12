import React, { memo } from 'react';
import { MdEdit, MdCheckCircle, MdHelpOutline, MdRemoveCircle, MdLink } from 'react-icons/md';
import type { PreferenceExtraction, PreferenceRemoval } from '@/types/preferences';
import { formatConfidence } from '@/lib/preferenceUtils';
import styles from './PreferenceBubble.module.css';

interface PreferenceBubbleProps {
  extraction?: PreferenceExtraction;
  removal?: PreferenceRemoval;
  onEdit?: (field: string, value: any) => void;
  onRemove?: (field: string, value: any) => void;
  onClick?: () => void;
  onViewSource?: (messageId: string) => void;
  showMetadata?: boolean;
}

export const PreferenceBubble: React.FC<PreferenceBubbleProps> = memo(({
  extraction,
  removal,
  onEdit,
  onRemove,
  onClick,
  onViewSource,
  showMetadata = true
}) => {
  if (removal) {
    return (
      <div className={`${styles.bubble} ${styles.removal} ${styles.medium}`}>
        <MdRemoveCircle className={styles.icon} />
        <span className={styles.label}>
          Removed: {Array.isArray(removal.value) ? removal.value.join(', ') : removal.value}
        </span>
      </div>
    );
  }

  if (!extraction) return null;

  const fieldLabels: Record<string, string> = {
    roomType: 'Room',
    designStyle: 'Style',
    budgetRange: 'Budget',
    colorTheme: 'Colors',
    mustBuyFurniture: 'Furniture',
    furnitureLayout: 'Layout'
  };

  const label = fieldLabels[extraction.field] || extraction.field;
  const valueDisplay = Array.isArray(extraction.value)
    ? extraction.value.join(', ')
    : extraction.value;

  const confidenceClass = extraction.confidence || 'medium';
  
  const confidenceMap: Record<string, number> = {
    'high': 0.9,
    'medium': 0.6,
    'low': 0.3
  };
  const confidenceNum = confidenceMap[extraction.confidence] || 0.6;

  return (
    <div
      className={`${styles.bubble} ${styles[confidenceClass]} ${extraction.isUpdate ? styles.update : styles.new}`}
      onClick={onClick}
      title={`${label}: ${valueDisplay} (${extraction.confidence} confidence)`}
    >
      <div className={styles.content}>
        {extraction.confidence === 'low' && (
          <MdHelpOutline className={styles.helpIcon} />
        )}
        {extraction.confidence === 'high' && (
          <MdCheckCircle className={styles.checkIcon} />
        )}
        <span className={styles.label}>{label}:</span>
        <span className={styles.value}>{valueDisplay}</span>
        {extraction.isUpdate && (
          <span className={styles.updateBadge}>Updated</span>
        )}
      </div>
      
      {showMetadata && (
        <div className={styles.metadata}>
          <span className={styles.confidenceBadge} title={`Confidence: ${formatConfidence(confidenceNum)}`}>
            {formatConfidence(confidenceNum)}
          </span>
          {onViewSource && extraction.sourceMessageId && (
            <button
              className={styles.sourceButton}
              onClick={(e) => {
                e.stopPropagation();
                onViewSource(extraction.sourceMessageId);
              }}
              title="View source message"
              aria-label="View source message"
            >
              <MdLink size={12} />
            </button>
          )}
        </div>
      )}
      
      {(onEdit || onRemove) && (
        <div className={styles.actions}>
          {onEdit && (
            <button
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(extraction.field, extraction.value);
              }}
              aria-label="Edit preference"
            >
              <MdEdit size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
});

PreferenceBubble.displayName = 'PreferenceBubble';
