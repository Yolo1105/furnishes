'use client';

import React, { useState } from 'react';
import styles from '../RightSidebar.module.css';
import { FolderItem } from './types';

type SummaryContentProps = {
  isLoggedIn: boolean;
};

const SummaryContent: React.FC<SummaryContentProps> = ({ isLoggedIn }) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['my-plans']);

  // Mock folder structure
  const folders: FolderItem[] = [
    {
      id: 'my-plans',
      name: 'My Plans',
      type: 'folder',
      children: [
        { id: 'living-room-2024', name: 'Living Room Makeover', type: 'plan', date: 'Jan 5, 2026' },
        { id: 'bedroom-minimal', name: 'Minimalist Bedroom', type: 'plan', date: 'Dec 28, 2025' },
        {
          id: 'kitchen-folder',
          name: 'Kitchen Projects',
          type: 'folder',
          children: [
            { id: 'modern-kitchen', name: 'Modern Kitchen', type: 'plan', date: 'Dec 15, 2025' },
          ]
        },
      ]
    },
    {
      id: 'shared',
      name: 'Shared with Me',
      type: 'folder',
      children: [
        { id: 'office-collab', name: 'Office Space (Sarah)', type: 'plan', date: 'Jan 2, 2026' },
      ]
    },
    {
      id: 'archived',
      name: 'Archived',
      type: 'folder',
      children: []
    },
  ];

  const suggestions = [
    { id: 1, text: 'Select your style preferences', completed: true },
    { id: 2, text: 'Set your budget range', completed: true },
    { id: 3, text: 'Place furniture in planner', completed: false },
    { id: 4, text: 'Run validation check', completed: false },
  ];

  const completedCount = suggestions.filter(s => s.completed).length;

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderFolderItem = (item: FolderItem, depth: number = 0) => {
    const isExpanded = expandedFolders.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          className={styles.folderItem}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => item.type === 'folder' && toggleFolder(item.id)}
        >
          {item.type === 'folder' ? (
            <>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={`${styles.folderChevron} ${isExpanded ? styles.chevronExpanded : ''}`}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isExpanded ? '#E55E00' : '#d4a574'} stroke="none">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </>
          ) : (
            <>
              <span className={styles.folderSpacer}></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7a6b" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </>
          )}
          <span className={styles.folderName}>{item.name}</span>
          {item.type === 'folder' && hasChildren && (
            <span className={styles.folderCount}>{item.children?.length}</span>
          )}
        </button>
        {item.type === 'folder' && isExpanded && item.children && (
          <div className={styles.folderChildren}>
            {item.children.map(child => renderFolderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Not logged in state
  if (!isLoggedIn) {
    return (
      <div className={styles.summaryContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Dashboard</h2>
          <p className={styles.sectionDescription}>View your plans, progress, and suggestions.</p>
        </div>
        <div className={styles.dashboardEmpty}>
          <div className={styles.dashboardEmptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4c4b8" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className={styles.dashboardEmptyTitle}>Your Dashboard</h3>
          <p className={styles.dashboardEmptyText}>
            Sign in to access your experience plans, saved designs, and personalized suggestions.
          </p>
        </div>
      </div>
    );
  }

  // Logged in state
  return (
    <div className={styles.summaryContent}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Dashboard</h2>
        <p className={styles.sectionDescription}>View your plans, progress, and suggestions.</p>
      </div>
      {/* Directory Structure */}
      <div className={styles.directorySection}>
        <div className={styles.directoryHeader}>
          <h3 className={styles.directoryTitle}>Experience Plans</h3>
          <button className={styles.newPlanButton} title="New Plan">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <div className={styles.folderTree}>
          {folders.map(folder => renderFolderItem(folder))}
        </div>
      </div>

      {/* Setup Suggestions */}
      <div className={styles.suggestionsSection}>
        <div className={styles.suggestionsHeader}>
          <span>Setup Suggestions</span>
          <span className={styles.suggestionsCount}>{completedCount}/{suggestions.length}</span>
        </div>
        
        {/* Progress Bar */}
        <div className={styles.suggestionsProgress}>
          <div 
            className={styles.suggestionsProgressFill} 
            style={{ width: `${(completedCount / suggestions.length) * 100}%` }} 
          />
        </div>

        <div className={styles.suggestionsList}>
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className={styles.suggestionItem}>
              <span className={`${styles.suggestionDot} ${suggestion.completed ? styles.suggestionCompleted : ''}`} />
              <span className={`${styles.suggestionText} ${suggestion.completed ? styles.suggestionTextCompleted : ''}`}>
                {suggestion.text}
              </span>
            </div>
          ))}
        </div>

        <button className={styles.generateReportButton}>
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default SummaryContent;
