'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProject } from '@/contexts/ProjectContext';
import styles from '../RightSidebar.module.css';

const SummaryUserChoices: React.FC = () => {
  const router = useRouter();
  const { state } = useProject();
  const [showUpdateAnimation, setShowUpdateAnimation] = useState(false);
  const prevStylePackRef = useRef(state.stylePack);
  const styleCardRef = useRef<HTMLDivElement>(null);
  
  // Get style data from ProjectContext
  const stylePack = state.stylePack;
  const budgetPlan = state.budgetPlan;
  const roomConfig = state.roomConfig;

  // Detect when stylePack is updated and trigger animation
  useEffect(() => {
    // Only trigger if stylePack exists and has changed
    if (state.stylePack && prevStylePackRef.current !== state.stylePack) {
      // Check if it's actually a different stylePack (not just initial load)
      const prevDirection = prevStylePackRef.current?.direction;
      const newDirection = state.stylePack?.direction;
      
      if (prevDirection && newDirection && prevDirection !== newDirection) {
        // Style pack was updated (not just set for first time)
        setShowUpdateAnimation(true);
        setTimeout(() => {
          setShowUpdateAnimation(false);
        }, 2500);
      }
    }
    prevStylePackRef.current = state.stylePack;
  }, [state.stylePack]);
  
  // Build user choices from actual data
  const userChoices = {
    style: {
      primary: stylePack?.direction || 'Not set',
      secondary: stylePack?.materials?.[0] || '',
      colors: stylePack?.palette || [],
    },
    budget: {
      total: budgetPlan ? `$${budgetPlan.total.toLocaleString()}` : 'Not set',
      tier: budgetPlan 
        ? budgetPlan.total < 2500 ? 'Budget-Friendly'
        : budgetPlan.total < 7500 ? 'Moderate'
        : budgetPlan.total < 15000 ? 'Premium'
        : 'Luxury'
        : '',
      spent: budgetPlan 
        ? `$${Object.values(budgetPlan.allocations).reduce((a, b) => a + b, 0).toLocaleString()}`
        : '$0',
    },
    room: {
      name: roomConfig ? 'Room Configured' : 'Not set',
      dimensions: roomConfig 
        ? `${roomConfig.dimensions.width}ft × ${roomConfig.dimensions.length}ft`
        : '',
    },
  };

  return (
    <div className={styles.summaryChoicesContent}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <p className={styles.sectionDescription}>Your current selections and preferences.</p>
      </div>

      {/* Style Choice */}
      <div 
        ref={styleCardRef}
        className={`${styles.choiceCard} ${showUpdateAnimation ? styles.styleCardUpdated : ''}`}
      >
        {showUpdateAnimation && (
          <div className={styles.updateAnimation}>
            <div className={styles.bloomEffect}></div>
            <div className={styles.confettiContainer}>
              {[...Array(30)].map((_, i) => {
                const randomX = (Math.random() - 0.5) * 2;
                return (
                  <div key={i} className={styles.confetti} style={{
                    '--delay': `${i * 0.05}s`,
                    '--x': `${50 + randomX * 30}%`,
                    '--random-x': randomX,
                    '--color': ['#F97316', '#EA580C', '#FB923C', '#FED7AA', '#FFEDD5', '#FFF7ED'][Math.floor(Math.random() * 6)]
                  } as React.CSSProperties}></div>
                );
              })}
            </div>
          </div>
        )}
        <div className={styles.choiceCardHeader}>
          <span className={styles.choiceCardLabel}>Style</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showUpdateAnimation && (
              <span className={styles.updateBadge}>Updated!</span>
            )}
            <button
              className={styles.navIconButton}
              onClick={() => router.push('/style')}
              title="Go to Style page"
              aria-label="Navigate to Style page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.choiceCardContent}>
          <p className={styles.choicePrimary}>{userChoices.style.primary}</p>
          {userChoices.style.secondary && (
            <p className={styles.choiceSecondary}>+ {userChoices.style.secondary}</p>
          )}
          {userChoices.style.colors.length > 0 ? (
            <div className={styles.colorSwatches}>
              {userChoices.style.colors.slice(0, 6).map((color, index) => (
                <div key={index} className={styles.colorSwatch} style={{ backgroundColor: color }} />
              ))}
            </div>
          ) : (
            <p className={styles.choiceSecondary} style={{ fontStyle: 'italic', opacity: 0.6 }}>
              No colors selected yet
            </p>
          )}
        </div>
      </div>

      {/* Budget Choice */}
      <div className={styles.choiceCard}>
        <div className={styles.choiceCardHeader}>
          <span className={styles.choiceCardLabel}>Budget</span>
          <button
            className={styles.navIconButton}
            onClick={() => router.push('/budget')}
            title="Go to Budget page"
            aria-label="Navigate to Budget page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
        <div className={styles.choiceCardContent}>
          <p className={styles.choicePrimary}>{userChoices.budget.total}</p>
          {userChoices.budget.tier && (
            <p className={styles.choiceSecondary}>{userChoices.budget.tier} Tier</p>
          )}
          {budgetPlan && (
            <>
              <div className={styles.budgetProgress}>
                <div 
                  className={styles.budgetProgressBar} 
                  style={{ 
                    width: `${(Object.values(budgetPlan.allocations).reduce((a, b) => a + b, 0) / budgetPlan.total) * 100}%` 
                  }} 
                />
              </div>
              <p className={styles.budgetSpent}>{userChoices.budget.spent} spent</p>
            </>
          )}
        </div>
      </div>

      {/* Validate Info */}
      <div className={styles.choiceCard}>
        <div className={styles.choiceCardHeader}>
          <span className={styles.choiceCardLabel}>Validate</span>
          <button
            className={styles.navIconButton}
            onClick={() => router.push('/validate')}
            title="Go to Validate page"
            aria-label="Navigate to Validate page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
        <div className={styles.choiceCardContent}>
          <p className={styles.choicePrimary}>{userChoices.room.name}</p>
          {userChoices.room.dimensions && (
            <p className={styles.choiceSecondary}>{userChoices.room.dimensions}</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default SummaryUserChoices;
