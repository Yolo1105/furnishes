'use client';

import React from 'react';
import styles from './ExportOptions.module.css';

interface ExportOptionsProps {
  onDownloadPDF?: () => void;
  onDownloadCSV?: () => void;
  onCopyLink?: () => void;
}

export default function ExportOptions({
  onDownloadPDF,
  onDownloadCSV,
  onCopyLink
}: ExportOptionsProps) {
  return (
    <div className={styles.exportOptions}>
      <div className={styles.optionCard}>
        <div className={styles.optionIcon}>📄</div>
        <div className={styles.optionContent}>
          <h3 className={styles.optionTitle}>Design Plan PDF</h3>
          <p className={styles.optionDescription}>
            Complete plan with room layout, style direction, and item specifications
          </p>
        </div>
        <div className={styles.optionActions}>
          <button className={styles.previewButton}>Preview</button>
          <button className={styles.downloadButton} onClick={onDownloadPDF}>
            Download PDF
          </button>
        </div>
      </div>

      <div className={styles.optionCard}>
        <div className={styles.optionIcon}>🛒</div>
        <div className={styles.optionContent}>
          <h3 className={styles.optionTitle}>Shopping List</h3>
          <p className={styles.optionDescription}>
            All items with prices, dimensions, and purchase links
          </p>
        </div>
        <div className={styles.optionActions}>
          <button className={styles.previewButton}>Preview</button>
          <button className={styles.downloadButton} onClick={onDownloadCSV}>
            Download CSV
          </button>
        </div>
      </div>

      <div className={styles.optionCard}>
        <div className={styles.optionIcon}>🔗</div>
        <div className={styles.optionContent}>
          <h3 className={styles.optionTitle}>Share Link</h3>
          <p className={styles.optionDescription}>
            Share with family, roommates, or your designer
          </p>
        </div>
        <div className={styles.optionActions}>
          <div className={styles.linkInput}>
            <input
              type="text"
              value="furnishes.com/plan/abc123xyz"
              readOnly
              className={styles.linkField}
            />
            <button className={styles.copyButton} onClick={onCopyLink}>
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
