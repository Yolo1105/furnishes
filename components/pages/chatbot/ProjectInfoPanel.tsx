'use client';

import React, { useState } from 'react';
import styles from './ProjectInfoPanel.module.css';

// Types
export interface ProjectInfo {
  roomType: string;
  designStyle: string;
  budgetRange: string;
  colorTheme: string[];
  mustBuyFurniture: string[];
  furnitureLayout: string;
}

interface ProjectInfoPanelProps {
  projectInfo: ProjectInfo;
  activeTab: 'overview' | 'analysis';
  onTabChange: (tab: 'overview' | 'analysis') => void;
  onUpdate?: (field: keyof ProjectInfo, value: string | string[]) => void;
}

export const ProjectInfoPanel: React.FC<ProjectInfoPanelProps> = ({
  projectInfo,
  activeTab,
  onTabChange,
}) => {
  const hasProjectInfo = () => {
    return (
      projectInfo.roomType ||
      projectInfo.designStyle ||
      projectInfo.budgetRange ||
      projectInfo.colorTheme.length > 0 ||
      projectInfo.mustBuyFurniture.length > 0
    );
  };

  const getFilledFieldsCount = () => {
    let count = 0;
    if (projectInfo.roomType) count++;
    if (projectInfo.designStyle) count++;
    if (projectInfo.budgetRange) count++;
    if (projectInfo.colorTheme.length > 0) count++;
    if (projectInfo.mustBuyFurniture.length > 0) count++;
    return count;
  };

  const totalFields = 5;
  const filledFields = getFilledFieldsCount();
  const progressPercent = (filledFields / totalFields) * 100;

  return (
    <aside className={styles.sidebar}>
      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button
          onClick={() => onTabChange('overview')}
          className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <span>Overview</span>
        </button>
        <button
          onClick={() => onTabChange('analysis')}
          className={`${styles.tab} ${activeTab === 'analysis' ? styles.activeTab : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Analysis</span>
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'overview' ? (
          <div className={styles.overviewContent}>
            {/* Brainstorm Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Brainstorm Summary</span>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Project Completion</span>
                  <span className={styles.progressCount}>{filledFields}/{totalFields}</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Summary Content */}
              <div className={styles.summaryDetails}>
                {hasProjectInfo() ? (
                  <>
                    {projectInfo.roomType && <div>Room: {projectInfo.roomType}</div>}
                    {projectInfo.designStyle && <div>Style: {projectInfo.designStyle}</div>}
                    {projectInfo.budgetRange && <div>Budget: {projectInfo.budgetRange}</div>}
                    {projectInfo.colorTheme.length > 0 && <div>Colors: {projectInfo.colorTheme.join(', ')}</div>}
                    {projectInfo.mustBuyFurniture.length > 0 && <div>Furniture: {projectInfo.mustBuyFurniture.join(', ')}</div>}
                  </>
                ) : (
                  <div className={styles.emptyText}>No project details yet</div>
                )}
              </div>
            </div>

            {/* Room Type Section */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Room Type</span>
              </div>
              <div className={styles.cardDescription}>The room you want to design</div>
              {projectInfo.roomType && (
                <div className={styles.currentValue}>
                  Current: {projectInfo.roomType}
                </div>
              )}
              <div className={styles.exampleSection}>
                <div className={styles.exampleLabel}>Examples:</div>
                <div className={styles.tagList}>
                  {['living room', 'bedroom', 'kitchen', 'bathroom', 'office'].map((room) => (
                    <span 
                      key={room} 
                      className={`${styles.tag} ${projectInfo.roomType === room ? styles.tagSelected : ''}`}
                    >
                      {room}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Design Style Section */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Design Style</span>
              </div>
              <div className={styles.cardDescription}>Your preferred aesthetic</div>
              {projectInfo.designStyle && (
                <div className={styles.currentValue}>
                  Current: {projectInfo.designStyle}
                </div>
              )}
              <div className={styles.exampleSection}>
                <div className={styles.exampleLabel}>Examples:</div>
                <div className={styles.tagList}>
                  {['modern', 'traditional', 'minimalist', 'scandinavian', 'industrial', 'bohemian'].map((style) => (
                    <span 
                      key={style} 
                      className={`${styles.tag} ${projectInfo.designStyle === style ? styles.tagSelected : ''}`}
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Preferences Section */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span>Color Preferences</span>
              </div>
              <div className={styles.cardDescription}>Colors you want to incorporate</div>
              <div className={styles.exampleSection}>
                <div className={styles.exampleLabel}>Examples:</div>
                <div className={styles.tagList}>
                  {['blue', 'green', 'neutral', 'warm tones', 'cool tones'].map((color) => (
                    <span key={color} className={styles.tag}>{color}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Furniture Needs Section */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Furniture Needs</span>
              </div>
              <div className={styles.cardDescription}>Furniture items you need</div>
              <div className={styles.exampleSection}>
                <div className={styles.exampleLabel}>Examples:</div>
                <div className={styles.tagList}>
                  {['sofa', 'bed', 'dining table', 'coffee table', 'lighting'].map((item) => (
                    <span key={item} className={styles.tag}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.analysisContent}>
            <div className={styles.analysisCard}>
              <div className={styles.analysisHeader}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span>Decision History</span>
              </div>
              <div className={styles.analysisDescription}>
                Track your design decisions and thinking process over time.
              </div>
              <div className={styles.emptyAnalysis}>
                <p>No analysis data yet.</p>
                <p>Start chatting to build your design history!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProjectInfoPanel;
