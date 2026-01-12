'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useStyleDiscovery } from '@/contexts/StyleDiscoveryContext';
import { 
  styleDescriptions, 
  spaceOptions, 
  moodWords, 
  sceneOptions, 
  quickChoices, 
  colorPalettes, 
  textureOptions, 
  sliderOptions,
  organizationOptions,
  homeLifeOptions,
  plantOptions,
  spaceStrugglesOptions,
  wellnessGoalOptions,
  finalRoomOptions
} from '@/data/style-discovery-data';
import type { StyleType } from '@/contexts/StyleDiscoveryContext';
import styles from './ResultsPage.module.css';

export default function ResultsPage() {
  const { state, calculateResult } = useStyleDiscovery();

  // Calculate result if not already calculated
  useEffect(() => {
    if (!state.styleResult) {
      calculateResult();
    }
  }, [state.styleResult, calculateResult]);

  const styleResult = state.styleResult || 'Warm Minimalist';
  const styleData = styleDescriptions[styleResult as StyleType];

  const renderDNABar = (leftLabel: string, rightLabel: string, value: number) => {
    const dots = Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`${styles.dnaDot} ${i < value ? styles.filled : ''}`}
      />
    ));

    return (
      <div className={styles.dnaRow}>
        <span className={styles.dnaLabel}>{leftLabel}</span>
        <div className={styles.dnaDots}>{dots}</div>
        <span className={styles.dnaLabel}>{rightLabel}</span>
      </div>
    );
  };

  // Helper function to get quiz answers summary
  const getQuizSummary = useMemo(() => {
    const summary: Array<{ title: string; items: string[] }> = [];

    // Page 1: Spaces
    if (state.answers['page-1']) {
      const selected = (state.answers['page-1'] as string[]).map(id => 
        spaceOptions.find(opt => opt.id === id)?.name
      ).filter(Boolean) as string[];
      if (selected.length > 0) {
        summary.push({ title: 'Spaces You Love', items: selected });
      }
    }

    // Page 2: Mood Words
    if (state.answers['page-2']) {
      const selected = (state.answers['page-2'] as string[]).map(id => 
        moodWords.find(word => word.id === id)?.word
      ).filter(Boolean) as string[];
      if (selected.length > 0) {
        summary.push({ title: 'Mood Words', items: selected });
      }
    }

    // Page 3: Morning Scene
    if (state.answers['page-3']) {
      const scene = sceneOptions.find(opt => opt.id === state.answers['page-3']);
      if (scene) {
        summary.push({ title: 'Morning Scene', items: [scene.name] });
      }
    }

    // Page 4: Quick Fire Choices
    if (state.answers['page-4']) {
      const choices = (state.answers['page-4'] as string[]).map(id => {
        for (const pair of quickChoices) {
          if (pair.left.id === id) return pair.left.label;
          if (pair.right.id === id) return pair.right.label;
        }
        return null;
      }).filter(Boolean) as string[];
      if (choices.length > 0) {
        summary.push({ title: 'Quick Choices', items: choices });
      }
    }

    // Page 5: Color Palette
    if (state.answers['page-5']) {
      const palette = colorPalettes.find(p => p.id === state.answers['page-5']);
      if (palette) {
        summary.push({ title: 'Color Palette', items: [palette.name] });
      }
    }

    // Page 6: Textures
    if (state.answers['page-6']) {
      const selected = (state.answers['page-6'] as string[]).map(id => 
        textureOptions.find(opt => opt.id === id)?.name
      ).filter(Boolean) as string[];
      if (selected.length > 0) {
        summary.push({ title: 'Favorite Textures', items: selected });
      }
    }

    // Page 7: Furniture Ratings
    if (state.answers['page-7']) {
      const ratings = state.answers['page-7'] as Record<string, number>;
      const items = Object.entries(ratings).map(([id, value]) => {
        const option = sliderOptions.find(opt => opt.id === id);
        return option ? `${option.label}: ${value}/10` : null;
      }).filter(Boolean) as string[];
      if (items.length > 0) {
        summary.push({ title: 'Furniture Preferences', items });
      }
    }

    // Page 8: Life Reality
    if (state.answers['page-8']) {
      const reality = state.answers['page-8'] as any;
      const items: string[] = [];
      if (reality.organization) {
        const org = organizationOptions.find(opt => opt.id === reality.organization);
        if (org) items.push(`Organization: ${org.label}`);
      }
      if (reality.homeLife) {
        const life = homeLifeOptions.find(opt => opt.id === reality.homeLife);
        if (life) items.push(`Home Life: ${life.label}`);
      }
      if (reality.plants) {
        const plant = plantOptions.find(opt => opt.id === reality.plants);
        if (plant) items.push(`Plants: ${plant.label}`);
      }
      if (items.length > 0) {
        summary.push({ title: 'Life Reality', items });
      }
    }

    // Page 9: Space Struggles
    if (state.answers['page-9']) {
      const selected = (state.answers['page-9'] as string[]).map(id => 
        spaceStrugglesOptions.find(opt => opt.id === id)?.label
      ).filter(Boolean) as string[];
      if (selected.length > 0) {
        summary.push({ title: 'Space Struggles', items: selected });
      }
    }

    // Page 10: Wellness Goal
    if (state.answers['page-10']) {
      const goal = wellnessGoalOptions.find(opt => opt.id === state.answers['page-10']);
      if (goal) {
        summary.push({ title: 'Wellness Goal', items: [goal.label] });
      }
    }

    // Page 11: Final Choice
    if (state.answers['page-11']) {
      const room = finalRoomOptions.find(opt => opt.id === state.answers['page-11']);
      if (room) {
        summary.push({ title: 'Final Choice', items: [room.name] });
      }
    }

    return summary;
  }, [state.answers]);

  return (
    <div className={styles.resultsPage}>
      <div className={styles.leftSection}>
        <div className={styles.imageContainer}>
          <Image
            src={styleData.image}
            alt={styleData.name}
            fill
            className={styles.image}
            sizes="40vw"
          />
        </div>
        <p className={styles.subtitle}>Your space personality</p>
        <h1 className={styles.styleName}>{styleData.name}</h1>
        <div className={styles.divider} />
        <p className={styles.description}>{styleData.description}</p>
        <div className={styles.divider} />
        <div className={styles.dnaSection}>
          <p className={styles.dnaTitle}>Your DNA</p>
          {renderDNABar('Minimal', 'Layered', styleData.dna.minimal)}
          {renderDNABar('Cool', 'Warm', styleData.dna.cool)}
          {renderDNABar('Bold', 'Subtle', styleData.dna.bold)}
          {renderDNABar('Simple', 'Complex', styleData.dna.simple)}
        </div>
        <div className={styles.divider} />
        <div className={styles.recommendations}>
          <p className={styles.recommendationsTitle}>Recommended for you:</p>
          <div className={styles.tags}>
            {styleData.recommendations.map((rec, index) => (
              <span key={index} className={styles.tag}>
                {rec}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.divider} />
        <button className={styles.exploreButton}>
          Explore furniture
        </button>
      </div>
      <div className={styles.rightSection}>
        <h2 className={styles.detailedHeader}>Detailed Results</h2>
        
        {/* Quiz Answers Summary */}
        <div className={styles.detailedSection}>
          <h3 className={styles.sectionTitle}>Your Quiz Answers</h3>
          <div className={styles.quizSummary}>
            {getQuizSummary.map((section, index) => (
              <div key={index} className={styles.summaryGroup}>
                <h4 className={styles.summaryGroupTitle}>{section.title}</h4>
                <div className={styles.summaryItems}>
                  {section.items.map((item, itemIndex) => (
                    <span key={itemIndex} className={styles.summaryItem}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Furniture Recommendations */}
        {styleData.furnitureRecommendations && styleData.furnitureRecommendations.length > 0 && (
          <div className={styles.detailedSection}>
            <h3 className={styles.sectionTitle}>Furniture Recommendations</h3>
            <ul className={styles.furnitureList}>
              {styleData.furnitureRecommendations.map((item, index) => (
                <li key={index} className={styles.furnitureItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Color Scheme */}
        {styleData.colorScheme && (
          <div className={styles.detailedSection}>
            <h3 className={styles.sectionTitle}>Color Scheme</h3>
            <div className={styles.colorScheme}>
              <div className={styles.colorSwatch}>
                <div 
                  className={styles.colorBox} 
                  style={{ backgroundColor: styleData.colorScheme.primary }}
                />
                <div className={styles.colorInfo}>
                  <span className={styles.colorLabel}>Primary</span>
                  <span className={styles.colorValue}>{styleData.colorScheme.primary}</span>
                </div>
              </div>
              <div className={styles.colorSwatch}>
                <div 
                  className={styles.colorBox} 
                  style={{ backgroundColor: styleData.colorScheme.secondary }}
                />
                <div className={styles.colorInfo}>
                  <span className={styles.colorLabel}>Secondary</span>
                  <span className={styles.colorValue}>{styleData.colorScheme.secondary}</span>
                </div>
              </div>
              <div className={styles.colorSwatch}>
                <div 
                  className={styles.colorBox} 
                  style={{ backgroundColor: styleData.colorScheme.accent }}
                />
                <div className={styles.colorInfo}>
                  <span className={styles.colorLabel}>Accent</span>
                  <span className={styles.colorValue}>{styleData.colorScheme.accent}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.saveButton}>Save results</button>
          <button className={styles.shareButton}>Share</button>
        </div>
      </div>
    </div>
  );
}
