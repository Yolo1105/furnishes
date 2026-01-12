'use client';

import React, { useState } from 'react';
import styles from './LeftSidebar.module.css';
import TutorialModal from './TutorialModal';
import { usePlaygroundContext } from '@/contexts/PlaygroundContext';
import { furnitureTemplates } from '@/data/furniture-data';

export default function LeftSidebar() {
  const [selectedCategory, setSelectedCategory] = useState('table');
  const { 
    state, 
    addFurniture, 
    calculateTotalCost, 
    getFurnitureName, 
    toggleTutorial
  } = usePlaygroundContext();

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'table':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
        );
      case 'chair':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="12" width="14" height="8" rx="1"/>
            <rect x="7" y="8" width="10" height="6" rx="1"/>
            <line x1="9" y1="12" x2="9" y2="20"/>
            <line x1="15" y1="12" x2="15" y2="20"/>
          </svg>
        );
      case 'desk':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="18" height="12" rx="1"/>
            <rect x="5" y="4" width="14" height="6" rx="1"/>
            <line x1="9" y1="8" x2="9" y2="20"/>
            <line x1="15" y1="8" x2="15" y2="20"/>
          </svg>
        );
      case 'shelf':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="6" y2="18"/>
            <line x1="10" y1="8" x2="10" y2="18"/>
            <line x1="14" y1="10" x2="14" y2="18"/>
            <line x1="18" y1="12" x2="18" y2="18"/>
            <line x1="6" y1="18" x2="18" y2="18"/>
          </svg>
        );
      case 'cabinet':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="1"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
          </svg>
        );
      case 'sofa':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="12" width="18" height="8" rx="2"/>
            <rect x="5" y="8" width="14" height="6" rx="2"/>
            <line x1="7" y1="12" x2="7" y2="20"/>
            <line x1="17" y1="12" x2="17" y2="20"/>
          </svg>
        );
      case 'bed':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="18" height="12" rx="1"/>
            <rect x="5" y="4" width="14" height="6" rx="1"/>
            <line x1="9" y1="8" x2="9" y2="20"/>
            <line x1="15" y1="8" x2="15" y2="20"/>
          </svg>
        );
      case 'lamp':
        return (
          <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="6"/>
            <line x1="12" y1="14" x2="12" y2="20"/>
            <line x1="8" y1="20" x2="16" y2="20"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleAddFurniture = (template: any) => {
    addFurniture(template);
  };

  return (
    <div className={styles.leftSidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Choose Furniture</h3>
        <button 
          className={styles.helpIcon}
          onClick={toggleTutorial}
        >
          ?
        </button>
      </div>
      
      <div className={styles.categoriesList}>
        {furnitureTemplates.map((template) => (
          <button
            key={template.type}
            className={`${styles.categoryItem} ${
              selectedCategory === template.type ? styles.selected : ''
            }`}
            onClick={() => {
              setSelectedCategory(template.type);
              handleAddFurniture(template);
            }}
          >
            <div className={styles.categoryIcon}>
              {renderIcon(template.icon)}
            </div>
            <div className={styles.categoryContent}>
              <h4 className={styles.categoryName}>{template.name}</h4>
              <p className={styles.categoryDescription}>{template.description}</p>
            </div>
          </button>
        ))}
      </div>
      
      <div className={styles.designSummary}>
        <h4 className={styles.summaryTitle}>Design Summary</h4>
        <div className={styles.summaryItems}>
          {state.furnitureItems.map((item) => {
            const itemCost = item.components?.filter(c => c.selected).reduce((sum, c) => sum + (c.price || 0), 0) || 0;
            
            return (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.itemName}>
                  <span>{getFurnitureName(item)}</span>
                  <span className={styles.itemPrice}>${itemCost}</span>
                </div>
                <div className={styles.itemDetails}>
                  {item.components && Object.entries(
                    item.components.reduce((groups, comp) => {
                      if (!groups[comp.type]) groups[comp.type] = [];
                      groups[comp.type].push(comp);
                      return groups;
                    }, {} as { [key: string]: any[] })
                  ).map(([type, components]) => {
                    const selectedComponent = components.find(c => c.selected);
                    if (!selectedComponent) return null;
                    return (
                      <div key={type} className={styles.detailRow}>
                        <span>{selectedComponent.name}</span>
                        <span className={styles.detailPrice}>${selectedComponent.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.totalCost}>
          <span>Total Cost:</span>
          <span className={styles.totalPrice}>${calculateTotalCost()}</span>
        </div>
      </div>
      
      <TutorialModal 
        isOpen={state.showTutorial}
        onClose={toggleTutorial}
      />
    </div>
  );
}
