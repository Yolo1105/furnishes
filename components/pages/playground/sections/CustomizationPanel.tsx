'use client';

import React, { useState, useEffect } from 'react';
import styles from './CustomizationPanel.module.css';
import { usePlaygroundContext } from '@/contexts/PlaygroundContext';
import { colors, materials } from '@/data/furniture-data';
import type { FurnitureComponent } from '@/types/furniture';

export default function CustomizationPanel() {
  const [activeTab, setActiveTab] = useState('components');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const { 
    getSelectedFurniture, 
    updateFurniture, 
    updateComponent 
  } = usePlaygroundContext();

  const selectedFurniture = getSelectedFurniture();

  // Auto-select first component if none selected or when furniture changes
  useEffect(() => {
    if (selectedFurniture?.components && selectedFurniture.components.length > 0) {
      const firstSelectedComponent = selectedFurniture.components.find(c => c.selected);
      if (firstSelectedComponent) {
        setSelectedComponent(firstSelectedComponent.id);
      } else {
        // If no component is selected, select the first one
        setSelectedComponent(selectedFurniture.components[0].id);
      }
    } else {
      setSelectedComponent(null);
    }
  }, [selectedFurniture]);

  if (!selectedFurniture) {
    return (
      <div className={styles.customizationPanel}>
        <div className={styles.header}>
          <h3 className={styles.title}>Customize Item</h3>
        </div>
        <div className={styles.noSelection}>
          <p>No furniture selected</p>
          <p>Click on furniture in the room to customize it</p>
        </div>
      </div>
    );
  }

  const getFurnitureDimensions = (type: string) => {
    switch (type) {
      case 'table': return '200cm × 100cm × 75cm';
      case 'chair': return '50cm × 50cm × 80cm';
      case 'desk': return '150cm × 80cm × 75cm';
      case 'shelf': return '100cm × 30cm × 120cm';
      case 'cabinet': return '100cm × 50cm × 150cm';
      case 'sofa': return '200cm × 80cm × 85cm';
      case 'bed': return '200cm × 160cm × 60cm';
      case 'lamp': return '30cm × 30cm × 60cm';
      default: return 'Standard dimensions';
    }
  };

  const getFurniturePrice = () => {
    return selectedFurniture.components?.filter(c => c.selected).reduce((sum, c) => sum + (c.price || 0), 0) || 0;
  };

  const getSelectedComponent = () => {
    if (!selectedComponent) return null;
    return selectedFurniture.components?.find(c => c.id === selectedComponent);
  };

  const handleComponentSelect = (componentId: string) => {
    // Component selected
    setSelectedComponent(componentId);
    setActiveTab('customize');
  };

  const handleColorChange = (color: string) => {
    if (!selectedComponent) return;
    updateFurniture(selectedFurniture.id, {
      customization: { 
        ...selectedFurniture.customization, 
        [`${selectedComponent}-color`]: color 
      }
    });
  };

  const handleMaterialChange = (material: string) => {
    if (!selectedComponent) return;
    updateFurniture(selectedFurniture.id, {
      customization: {
        ...selectedFurniture.customization,
        [`${selectedComponent}-material`]: material
      }
    });
  };

  const handleRotate = (direction: 'left' | 'right') => {
    if (!selectedFurniture) return;
    
    const currentRotation = selectedFurniture.rotation || [0, 0, 0];
    const rotationAmount = direction === 'left' ? -Math.PI / 2 : Math.PI / 2;
    const newRotation: [number, number, number] = [
      currentRotation[0],
      currentRotation[1] + rotationAmount,
      currentRotation[2]
    ];
    
    updateFurniture(selectedFurniture.id, { rotation: newRotation });
  };

  const handleScale = (direction: 'increase' | 'decrease') => {
    if (!selectedFurniture) return;
    
    const currentScale = selectedFurniture.scale || [1, 1, 1];
    const scaleFactor = direction === 'increase' ? 1.1 : 0.9;
    const newScale: [number, number, number] = [
      currentScale[0] * scaleFactor,
      currentScale[1] * scaleFactor,
      currentScale[2] * scaleFactor
    ];
    
    // Limit scaling between 0.5 and 2.0
    const clampedScale: [number, number, number] = [
      Math.max(0.5, Math.min(2.0, newScale[0])),
      Math.max(0.5, Math.min(2.0, newScale[1])),
      Math.max(0.5, Math.min(2.0, newScale[2]))
    ];
    
    updateFurniture(selectedFurniture.id, { scale: clampedScale });
  };

  return (
    <div className={styles.customizationPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Customize Item</h3>
      </div>
      
      <div className={styles.itemDetails}>
        <div className={styles.itemName}>
          {selectedFurniture.type.charAt(0).toUpperCase() + selectedFurniture.type.slice(1)} - {getFurnitureDimensions(selectedFurniture.type)}
        </div>
        <div className={styles.itemPrice}>${getFurniturePrice()}</div>
      </div>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'components' ? styles.active : ''}`}
          onClick={() => {
            setActiveTab('components');
            setSelectedComponent(null);
          }}
        >
          Components
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'customize' ? styles.active : ''}`}
          onClick={() => setActiveTab('customize')}
          disabled={!selectedComponent}
        >
          Customize {selectedComponent ? `(${getSelectedComponent()?.name})` : ''}
        </button>
      </div>
      
      {activeTab === 'components' && (
        <div className={styles.componentsSection}>
          {selectedFurniture.components && Object.entries(
            selectedFurniture.components.reduce((groups, comp) => {
              if (!groups[comp.type]) groups[comp.type] = [];
              groups[comp.type].push(comp);
              return groups;
            }, {} as Record<string, FurnitureComponent[]>)
          ).map(([type, components]) => (
            <div key={type} className={styles.componentGroup}>
              <h4 className={styles.componentTitle}>{type}</h4>
              <div className={styles.componentOptions}>
                {components.map((component) => (
                  <button
                    key={component.id}
                    className={`${styles.componentOption} ${
                      component.selected ? styles.selected : ''
                    }`}
                    onClick={() => {
                      updateComponent(selectedFurniture.id, component.id, true);
                      handleComponentSelect(component.id);
                    }}
                  >
                    <div className={styles.componentInfo}>
                      <div className={styles.componentName}>{component.name}</div>
                      <div className={styles.componentPrice}>${component.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'customize' && selectedComponent && (
        <div className={styles.customizeSection}>
          <div className={styles.selectedComponentInfo}>
            <h4 className={styles.selectedComponentTitle}>
              Customizing: {getSelectedComponent()?.name}
            </h4>
            <span className={styles.selectedComponentPrice}>
              ${getSelectedComponent()?.price}
            </span>
          </div>

          {/* Rotation Controls */}
          <div className={styles.rotationSection}>
            <h4 className={styles.rotationTitle}>Rotation</h4>
            <div className={styles.rotationControls}>
              <button 
                className={styles.rotateButton}
                onClick={() => handleRotate('left')}
                title="Rotate Left"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                </svg>
              </button>
              <button 
                className={styles.rotateButton}
                onClick={() => handleRotate('right')}
                title="Rotate Right"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Scaling Controls */}
          <div className={styles.scalingSection}>
            <h4 className={styles.scalingTitle}>Size</h4>
            <div className={styles.scalingControls}>
              <button 
                className={styles.scaleButton}
                onClick={() => handleScale('decrease')}
                title="Make Smaller"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span className={styles.scaleLabel}>
                {Math.round((selectedFurniture?.scale?.[0] || 1) * 100)}%
              </span>
              <button 
                className={styles.scaleButton}
                onClick={() => handleScale('increase')}
                title="Make Larger"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Color Section */}
          <div className={styles.colorSection}>
            <h4 className={styles.colorTitle}>Color</h4>
            <div className={styles.colorSwatches}>
              {colors.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorSwatch} ${
                    selectedFurniture.customization[`${selectedComponent}-color`] === color ? styles.selected : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          <div className={styles.materialSection}>
            <h4 className={styles.materialTitle}>Material</h4>
            <div className={styles.materialOptions}>
              {materials.map((material) => (
                <button
                  key={material.value}
                  className={`${styles.materialOption} ${
                    selectedFurniture.customization[`${selectedComponent}-material`] === material.value ? styles.selected : ''
                  }`}
                  onClick={() => handleMaterialChange(material.value)}
                >
                  <div className={styles.materialIcon}>
                    <svg className={styles.hollowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <line x1="9" y1="3" x2="9" y2="21"/>
                      <line x1="15" y1="3" x2="15" y2="21"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="3" y1="15" x2="21" y2="15"/>
                    </svg>
                  </div>
                  <div className={styles.materialInfo}>
                    <div className={styles.materialName}>{material.name}</div>
                    <div className={styles.materialDesc}>{material.name} material</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
