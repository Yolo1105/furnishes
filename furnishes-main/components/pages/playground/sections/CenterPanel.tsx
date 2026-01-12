'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import styles from './CenterPanel.module.css';
import { usePlaygroundContext } from '@/contexts/PlaygroundContext';
import DetailInfoPopup from '../components/DetailInfoPopup';
import type { Group } from 'three';
import type { FurnitureItem } from '@/types/furniture';

// Loading skeleton component
const ThreeLoadingSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Loading 3D scene...</p>
    </div>
  </div>
);

// Dynamically import the entire Three.js scene component
const ThreeScene = dynamic(() => import('./ThreeScene'), {
  ssr: false,
  loading: () => <ThreeLoadingSkeleton />
});


export default function CenterPanel() {
  const { state, selectItem, exportScene, importScene, resetScene, updateFurniture } = usePlaygroundContext();
  const selectedFurniture = state.furnitureItems.find(item => item.id === state.selectedItem);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedFurnitureRef = useRef<Group>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(false);
  const [isTransformActive, setIsTransformActive] = useState(false);
  const [collisionData, setCollisionData] = useState<{[key: string]: string[]}>({});

  const controlsRef = useRef<any>(null);
  const [currentView, setCurrentView] = useState('perspective');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate');
  const [showCollisionWarning, setShowCollisionWarning] = useState(false);

  const handleFurnitureClick = (itemId: string) => {
    selectItem(itemId);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importScene(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const takeScreenshot = () => {
    if (!canvasRef.current) return;
    
    try {
      // Get the canvas element
      const canvas = canvasRef.current;
      
      // Ensure the canvas is properly rendered
      canvas.toBlob((blob) => {
        if (blob) {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `room-screenshot-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          console.error('Failed to generate screenshot blob');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Screenshot error:', error);
    }
  };

  const setCameraView = (view: string) => {
    if (!controlsRef.current) return;
    
    setCurrentView(view);
    
    // Reset the controls to their default state first
    controlsRef.current.reset();
    
    switch (view) {
      case 'top':
        // Top view - camera above looking down
        controlsRef.current.object.position.set(0, 10, 0);
        controlsRef.current.target.set(0, 0, 0);
        break;
      case 'front':
        // Front view - camera in front looking at the scene
        controlsRef.current.object.position.set(0, 0, 10);
        controlsRef.current.target.set(0, 0, 0);
        break;
      case 'side':
        // Side view - camera to the side
        controlsRef.current.object.position.set(10, 0, 0);
        controlsRef.current.target.set(0, 0, 0);
        break;
      case 'perspective':
      default:
        // Perspective view - angled view
        controlsRef.current.object.position.set(8, 8, 8);
        controlsRef.current.target.set(0, 0, 0);
        break;
    }
    
    // Update the controls
    controlsRef.current.update();
  };

  // Handle keyboard shortcuts for transform modes
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        if (isTransformActive && transformMode === 'rotate') {
          setIsTransformActive(false);
        } else {
          setTransformMode('rotate');
          setIsTransformActive(true);
        }
      } else if (event.key === 'g' || event.key === 'G') {
        if (isTransformActive && transformMode === 'translate') {
          setIsTransformActive(false);
        } else {
          setTransformMode('translate');
          setIsTransformActive(true);
        }
      } else if (event.key === 'b' || event.key === 'B') {
        setShowBoundingBoxes(!showBoundingBoxes);
      } else if (event.key === 'Escape') {
        setIsTransformActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBoundingBoxes, isTransformActive, transformMode]);

  // Check if selected furniture has collision
  const selectedFurnitureHasCollision = selectedFurniture ? 
    (collisionData[selectedFurniture.id] && collisionData[selectedFurniture.id].length > 0) : false;

  // Handle collision detection updates
  const handleCollisionUpdate = (newCollisions: {[key: string]: string[]}) => {
    setCollisionData(newCollisions);
    const hasCollisions = Object.keys(newCollisions).length > 0;
    setShowCollisionWarning(hasCollisions);
  };


  return (
    <div className={styles.centerPanel}>
      {/* Camera View Controls */}
      <div className={styles.cameraControls}>
        <button 
          className={`${styles.viewButton} ${currentView === 'perspective' ? styles.active : ''}`}
          onClick={() => setCameraView('perspective')}
          title="Perspective View"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </button>
        <button 
          className={`${styles.viewButton} ${currentView === 'top' ? styles.active : ''}`}
          onClick={() => setCameraView('top')}
          title="Top View"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2v20"/>
            <path d="M2 12h20"/>
          </svg>
        </button>
        <button 
          className={`${styles.viewButton} ${currentView === 'front' ? styles.active : ''}`}
          onClick={() => setCameraView('front')}
          title="Front View"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
          </svg>
        </button>
        <button 
          className={`${styles.viewButton} ${currentView === 'side' ? styles.active : ''}`}
          onClick={() => setCameraView('side')}
          title="Side View"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
        </button>
        <div className={styles.cameraDivider}></div>
        <button 
          className={styles.viewButton}
          onClick={takeScreenshot}
          title="Take Screenshot"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
      </div>

      {/* Transform Controls */}
      <div className={styles.transformControls}>
        <button
          className={`${styles.transformButton} ${transformMode === 'translate' && isTransformActive ? styles.active : ''}`}
          onClick={() => {
            if (isTransformActive && transformMode === 'translate') {
              setIsTransformActive(false);
            } else {
              setTransformMode('translate');
              setIsTransformActive(true);
            }
          }}
          title="Move Mode (G)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 9l-3 3 3 3"/>
            <path d="M9 5l3 3-3 3"/>
            <path d="M15 19l3-3-3-3"/>
            <path d="M19 9l-3-3-3 3"/>
          </svg>
        </button>
        
        <button
          className={`${styles.transformButton} ${transformMode === 'rotate' && isTransformActive ? styles.active : ''}`}
          onClick={() => {
            if (isTransformActive && transformMode === 'rotate') {
              setIsTransformActive(false);
            } else {
              setTransformMode('rotate');
              setIsTransformActive(true);
            }
          }}
          title="Rotate Mode (R)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/>
            <path d="M12 3v9l6 6"/>
          </svg>
        </button>
        
        <button
          className={`${styles.transformButton} ${showBoundingBoxes ? styles.active : ''}`}
          onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
          title="Toggle Bounding Boxes (B)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
        </button>
      </div>

      {/* Export/Import/Clear Controls */}
      <div className={styles.actionControls}>
        <button 
          className={styles.actionButton}
          onClick={exportScene}
          disabled={state.furnitureItems.length === 0}
          title="Export Room Design"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
        
        <label className={styles.actionButton}>
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Import
        </label>
        
        <button 
          className={styles.actionButton}
          onClick={resetScene}
          disabled={state.furnitureItems.length === 0}
          title="Clear All Furniture"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Clear
        </button>
      </div>

      {/* Detailed Information Popup - positioned below the action controls */}
      <DetailInfoPopup 
        selectedFurniture={selectedFurniture}
        transformMode={transformMode}
        isTransformActive={isTransformActive}
        showBoundingBoxes={showBoundingBoxes}
        hasCollision={selectedFurnitureHasCollision}
        collisions={collisionData}
      />

      {/* Collision Warning - Top Left Corner */}
      {showCollisionWarning && (
        <div className={styles.collisionWarningTopLeft}>
          <div className={styles.warningHeader}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>Furniture Collisions Detected</span>
            <button 
              className={styles.closeWarning}
              onClick={() => setShowCollisionWarning(false)}
            >
              ×
            </button>
          </div>
          <div className={styles.collisionList}>
            {Object.entries(collisionData).map(([itemId, collidingWith]) => {
              const furniture = state.furnitureItems.find(item => item.id === itemId);
              const furnitureCollisions = collidingWith.filter(collision => !collision.includes('-wall'));
              const wallCollisions = collidingWith.filter(collision => collision.includes('-wall'));
              
              return (
                <div key={itemId} className={styles.collisionItem}>
                  <span className={styles.collisionItemName}>
                    {furniture?.type || 'Unknown Item'}
                  </span>
                  <span className={styles.collisionItemDetails}>
                    {furnitureCollisions.length > 0 && (
                      <div>
                        Colliding with: {furnitureCollisions.map(id => 
                          state.furnitureItems.find(item => item.id === id)?.type || 'Unknown Item'
                        ).join(', ')}
                      </div>
                    )}
                    {wallCollisions.length > 0 && (
                      <div>
                        Wall collisions: {wallCollisions.map(wall => 
                          wall.replace('-wall', ' wall')
                        ).join(', ')}
                      </div>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.threeSceneContainer}>
        <Suspense fallback={<ThreeLoadingSkeleton />}>
          <ThreeScene
            canvasRef={canvasRef}
            selectedFurnitureRef={selectedFurnitureRef}
            controlsRef={controlsRef}
            showBoundingBoxes={showBoundingBoxes}
            isTransformActive={isTransformActive}
            transformMode={transformMode}
            onFurnitureClick={handleFurnitureClick}
            onCollisionUpdate={handleCollisionUpdate}
            onTransformChange={(furniture, obj) => {
              updateFurniture(furniture.id, {
                position: [obj.position.x, obj.position.y, obj.position.z],
                rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                scale: [obj.scale.x, obj.scale.y, obj.scale.z]
              });
            }}
          />
        </Suspense>
      </div>
      
      {/* Instructions Overlay */}
      <div className={styles.interactionOverlay}>
        <div className={styles.instructionItem}>
          <svg className={styles.instructionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <line x1="6" y1="8" x2="18" y2="8"/>
            <line x1="6" y1="12" x2="18" y2="12"/>
            <line x1="6" y1="16" x2="14" y2="16"/>
          </svg>
          <span className={styles.instructionText}>WASD: Move Camera</span>
        </div>
        <div className={styles.instructionItem}>
          <svg className={styles.instructionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6"/>
            <path d="M1 12h6m6 0h6"/>
          </svg>
          <span className={styles.instructionText}>Alt + Mouse: Look Around</span>
        </div>
        <div className={styles.instructionItem}>
          <svg className={styles.instructionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1l22 22"/>
            <path d="M1 23l22-22"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span className={styles.instructionText}>Click: Select Furniture</span>
        </div>
        <div className={styles.instructionItem}>
          <svg className={styles.instructionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 6h8"/>
            <path d="M8 12h8"/>
            <path d="M8 18h8"/>
            <path d="M4 6h2"/>
            <path d="M4 12h2"/>
            <path d="M4 18h2"/>
          </svg>
          <span className={styles.instructionText}>G/R: Toggle Move/Rotate Controls</span>
        </div>
        <div className={styles.instructionItem}>
          <svg className={styles.instructionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
          <span className={styles.instructionText}>B: Toggle Bounding Boxes</span>
        </div>
        <div className={styles.instructionItem}>
          <svg className={styles.instructionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2v20"/>
            <path d="M2 12h20"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span className={styles.instructionText}>Mouse Wheel: Zoom</span>
        </div>
      </div>
    </div>
  );
}
