'use client';

import React, { useState } from 'react';
import PageHero from '@/components/shared/ui/PageHero';
import ExportOptions from '@/components/pages/export/ExportOptions';
import { useProject } from '@/contexts/ProjectContext';
import styles from './ReportPage.module.css';

export default function ReportPage() {
  const { state } = useProject();
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert('PDF download would be implemented here');
  };

  const handleDownloadCSV = () => {
    // In a real implementation, this would generate and download a CSV
    alert('CSV download would be implemented here');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('furnishes.com/plan/abc123xyz');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.reportPage}>
      <PageHero
        imageSrc="/images/hero-modern-room.jpg"
        imageAlt="Report hero image"
        title="Export your plan"
        titleHighlight="Export"
        description="Download your complete design plan and shopping list"
      />

      <section className={styles.section}>
        <div className={styles.contentLayer}>
          <div className={styles.summaryCards}>
            {state.stylePack && (
              <div className={styles.summaryCard}>
                <div className={styles.cardTitle}>Style Pack</div>
                <div className={styles.cardValue}>{state.stylePack.direction}</div>
                <div className={styles.cardStatus}>Generated</div>
              </div>
            )}
            {state.budgetPlan && (
              <div className={styles.summaryCard}>
                <div className={styles.cardTitle}>Budget</div>
                <div className={styles.cardValue}>
                  ${Object.values(state.budgetPlan.allocations).reduce((a, b) => a + b, 0).toLocaleString()} / ${state.budgetPlan.total.toLocaleString()}
                </div>
                <div className={styles.cardStatus}>
                  {state.budgetPlan.confidence === 'on_track' ? 'On track' : 'Review needed'}
                </div>
              </div>
            )}
            {state.layoutHealth && (
              <div className={styles.summaryCard}>
                <div className={styles.cardTitle}>Layout</div>
                <div className={styles.cardValue}>
                  {state.layoutHealth.overall === 'green' ? 'Green' : state.layoutHealth.overall === 'needs_attention' ? 'Needs attention' : 'Blocked'}
                </div>
                <div className={styles.cardStatus}>
                  {state.layoutHealth.overall === 'green' ? 'All clear' : 'Issues found'}
                </div>
              </div>
            )}
          </div>

          <div className={styles.exportSection}>
            <h2 className={styles.sectionTitle}>EXPORT OPTIONS</h2>
            <ExportOptions
              onDownloadPDF={handleDownloadPDF}
              onDownloadCSV={handleDownloadCSV}
              onCopyLink={handleCopyLink}
            />
          </div>

          {copied && (
            <div className={styles.toast}>Link copied!</div>
          )}

          <div className={styles.nextSteps}>
            <h3 className={styles.nextStepsTitle}>What&apos;s Next</h3>
            <ul className={styles.nextStepsList}>
              <li>Review your shopping list and compare prices</li>
              <li>Share with anyone who needs to approve</li>
              <li>Measure your space to double-check fit</li>
              <li>Start with your anchor pieces (sofa, bed, rug)</li>
            </ul>
            <button className={styles.newProjectButton}>
              Start a new project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
