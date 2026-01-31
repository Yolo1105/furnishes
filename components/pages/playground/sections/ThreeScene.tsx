'use client';

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, TransformControls } from '@react-three/drei';
import type { Group } from 'three';
import RoomEnvironment from '@/components/three/RoomEnvironment';
import Furniture3D from '@/components/three/Furniture3D';
import { usePlaygroundContext } from '@/contexts/PlaygroundContext';
import type { FurnitureItem } from '@/types/furniture';

interface ThreeSceneProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedFurnitureRef: React.RefObject<Group>;
  controlsRef: React.RefObject<any>;
  showBoundingBoxes: boolean;
  isTransformActive: boolean;
  transformMode: 'translate' | 'rotate';
  onFurnitureClick: (itemId: string) => void;
  onCollisionUpdate: (collisions: {[key: string]: string[]}) => void;
  onTransformChange: (furniture: FurnitureItem, obj: any) => void;
}

export default function ThreeScene({
  canvasRef,
  selectedFurnitureRef,
  controlsRef,
  showBoundingBoxes,
  isTransformActive,
  transformMode,
  onFurnitureClick,
  onCollisionUpdate,
  onTransformChange,
}: ThreeSceneProps) {
  const { state, updateFurniture } = usePlaygroundContext();
  const selectedFurniture = state.furnitureItems.find(item => item.id === state.selectedItem);

  return (
    <Canvas 
      camera={{ position: [0, 5, 5], fov: 70 }} 
      shadows
      style={{ background: '#f0f0f0' }}
      ref={canvasRef}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Room Environment */}
      <RoomEnvironment />
      
      {/* Furniture Items */}
      {state.furnitureItems.map((item) => (
        <Furniture3D
          key={item.id}
          item={item}
          isSelected={state.selectedItem === item.id}
          onSelect={() => onFurnitureClick(item.id)}
          ref={state.selectedItem === item.id ? selectedFurnitureRef : null}
          showBoundingBox={showBoundingBoxes}
          onCollisionUpdate={onCollisionUpdate}
          allFurniture={state.furnitureItems}
          roomDimensions={state.roomDimensions}
        />
      ))}
      
      {/* Transform Controls for selected furniture */}
      {state.selectedItem && isTransformActive && selectedFurnitureRef.current && (
        <TransformControls
          mode={transformMode}
          object={selectedFurnitureRef.current}
          size={1.2}
          showX={true}
          showY={true}
          showZ={true}
          translationSnap={0.1}
          rotationSnap={Math.PI / 12}
          space="world"
          camera={controlsRef.current?.object}
          onMouseDown={() => {
            // Disable camera controls when transform controls are active
            if (controlsRef.current) {
              controlsRef.current.enabled = false;
            }
          }}
          onMouseUp={() => {
            // Re-enable camera controls when transform controls are done
            if (controlsRef.current) {
              controlsRef.current.enabled = true;
            }
          }}
          onObjectChange={(e: any) => {
            if (e?.target?.object && selectedFurniture) {
              const obj = e.target.object;
              onTransformChange(selectedFurniture, obj);
            }
          }}
        />
      )}
      
      {/* Camera Controls */}
      <OrbitControls 
        ref={controlsRef}
        enablePan={!isTransformActive}
        enableZoom={!isTransformActive}
        enableRotate={!isTransformActive}
        minDistance={2}
        maxDistance={20}
      />
      
      {/* Environment */}
      <Environment preset="apartment" />
    </Canvas>
  );
}
