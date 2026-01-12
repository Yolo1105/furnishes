'use client';

import React, { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Mesh } from 'three';

interface ModelViewerProps {
  modelUrl: string;
  materials?: Record<string, any>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

interface ModelViewerState {
  isLoaded: boolean;
  hasError: boolean;
  errorMessage: string | null;
  progress: number;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  materials, 
  onLoad, 
  onError,
  className = ''
}) => {
  const [state, setState] = useState<ModelViewerState>({
    isLoaded: false,
    hasError: false,
    errorMessage: null,
    progress: 0,
  });

  // Load the 3D model
  const { scene } = useGLTF(modelUrl, true);

  // Memoize error handler
  const handleError = useCallback((error: Error | string) => {
    const errorMessage = error instanceof Error ? error.message : error;
    setState(prev => ({
      ...prev,
      hasError: true,
      errorMessage
    }));
    onError?.(new Error(errorMessage));
  }, [onError]);

  // Handle model loading
  useEffect(() => {
    if (scene) {
      setState(prev => ({ ...prev, isLoaded: true, progress: 100 }));
      onLoad?.();
    }
  }, [scene, onLoad]);

  // Apply materials to the model
  useEffect(() => {
    if (scene && materials) {
      try {
        // Traverse the scene and apply materials to meshes
        scene.traverse((child) => {
          if (child.type === 'Mesh' && (child as Mesh).material) {
            const mesh = child as Mesh;
            const meshName = child.name.toLowerCase();
            
            // Find matching material based on mesh name or material name
            const matchingMaterial = Object.entries(materials).find(([key]) => {
              const materialKey = key.toLowerCase();
              const currentMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
              return meshName.includes(materialKey) || 
                     materialKey.includes(meshName) ||
                     (currentMaterial.name && currentMaterial.name.toLowerCase().includes(materialKey));
            });
            
            if (matchingMaterial) {
              // Note: Material application requires conversion between our Material type
              // and Three.js Material type. For now, we log the match for debugging.
              // A full implementation would require creating Three.js materials from our data.
              // Found material match
            }
          }
        });
      } catch (error) {
        handleError(error instanceof Error ? error : 'Failed to apply materials');
      }
    }
  }, [scene, materials, handleError]);

  // Memoize loading component
  const LoadingComponent = useMemo(() => {
    const Component = () => (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading 3D model...</p>
          <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
    Component.displayName = 'LoadingComponent';
    return Component;
  }, [state.progress]);

  // Memoize error component
  const ErrorComponent = useMemo(() => {
    const Component = () => (
      <div className="flex items-center justify-center w-full h-full bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center p-4">
          <div className="text-red-500 text-2xl mb-2">Warning</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Model Loading Error</h3>
          <p className="text-sm text-red-600 mb-4">{state.errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
    Component.displayName = 'ErrorComponent';
    return Component;
  }, [state.errorMessage]);

  // If there's an error, show error component
  if (state.hasError) {
    return <ErrorComponent />;
  }

  // If not loaded yet, show loading component
  if (!state.isLoaded) {
    return <LoadingComponent />;
  }

  // Render the 3D model
  return (
    <Suspense fallback={<LoadingComponent />}>
      <primitive object={scene} className={className} />
    </Suspense>
  );
};

ModelViewer.displayName = 'ModelViewer';

export default ModelViewer;
