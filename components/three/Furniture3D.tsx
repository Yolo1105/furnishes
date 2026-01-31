'use client';

import { useRef, useState, forwardRef, useImperativeHandle, useEffect, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { usePlaygroundContext } from '@/contexts/PlaygroundContext';
import type { FurnitureItem } from '@/types/furniture';

interface Furniture3DProps {
  item: FurnitureItem;
  isSelected: boolean;
  onSelect: () => void;
  showBoundingBox?: boolean;
  onCollisionUpdate?: (collisions: {[key: string]: string[]}) => void;
  allFurniture?: FurnitureItem[];
  roomDimensions?: { width: number; length: number; height: number };
}

const Furniture3D = forwardRef<Group, Furniture3DProps>(function Furniture3D({ 
  item, 
  isSelected, 
  onSelect, 
  showBoundingBox = false,
  onCollisionUpdate,
  allFurniture = [],
  roomDimensions = { width: 8, length: 10, height: 3.5 }
}, ref) {
  const { updateFurniture } = usePlaygroundContext();
  const meshRef = useRef<Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<[number, number, number]>([0, 0, 0]);
  const [hasCollision, setHasCollision] = useState(false);


  // Expose the mesh ref to parent components
  useImperativeHandle(ref, () => meshRef.current!);

  // Collision detection
  const detectCollisions = () => {
    if (!onCollisionUpdate || allFurniture.length === 0) return;

    const collisions: {[key: string]: string[]} = {};

    // Get bounding box dimensions for furniture type
    const getBoundingBoxDimensions = (furnitureType: string) => {
      switch (furnitureType) {
        case 'table':
          return { width: 2.2, height: 1.6, depth: 1.2 };
        case 'chair':
          return { width: 0.7, height: 1.5, depth: 0.7 };
        case 'desk':
          return { width: 1.7, height: 1.6, depth: 1.0 };
        case 'shelf':
          return { width: 1.2, height: 1.4, depth: 0.5 };
        case 'cabinet':
          return { width: 1.2, height: 1.8, depth: 0.7 };
        case 'sofa':
          return { width: 2.2, height: 1.0, depth: 1.0 };
        case 'bed':
          return { width: 2.2, height: 0.8, depth: 1.8 };
        case 'lamp':
          return { width: 0.4, height: 1.2, depth: 0.4 };
        default:
          return { width: 1.2, height: 1.5, depth: 1.2 };
      }
    };

    // Check for collisions between all furniture items and walls
    for (let i = 0; i < allFurniture.length; i++) {
      const furniture1 = allFurniture[i];
      const pos1 = furniture1.position || [0, 0, 0];
      const dim1 = getBoundingBoxDimensions(furniture1.type);

      // Check wall collisions for this furniture item
      const wallCollisions: string[] = [];
      
      // Calculate furniture boundaries
      const furnitureLeft = pos1[0] - dim1.width / 2;
      const furnitureRight = pos1[0] + dim1.width / 2;
      const furnitureFront = pos1[2] - dim1.depth / 2;
      const furnitureBack = pos1[2] + dim1.depth / 2;
      
      // Room boundaries
      const roomLeft = -roomDimensions.width / 2;
      const roomRight = roomDimensions.width / 2;
      const roomFront = -roomDimensions.length / 2;
      const roomBack = roomDimensions.length / 2;
      
      // Check wall collisions
      if (furnitureLeft <= roomLeft) {
        wallCollisions.push('left-wall');
      }
      if (furnitureRight >= roomRight) {
        wallCollisions.push('right-wall');
      }
      if (furnitureFront <= roomFront) {
        wallCollisions.push('front-wall');
      }
      if (furnitureBack >= roomBack) {
        wallCollisions.push('back-wall');
      }
      
      // Add wall collisions to the furniture item
      if (wallCollisions.length > 0) {
        if (!collisions[furniture1.id]) {
          collisions[furniture1.id] = [];
        }
        collisions[furniture1.id].push(...wallCollisions);
      }

      // Check furniture-to-furniture collisions
      for (let j = i + 1; j < allFurniture.length; j++) {
        const furniture2 = allFurniture[j];
        const pos2 = furniture2.position || [0, 0, 0];
        const dim2 = getBoundingBoxDimensions(furniture2.type);

        // Check if bounding boxes overlap
        const overlapX = Math.abs(pos1[0] - pos2[0]) < (dim1.width + dim2.width) / 2;
        const overlapZ = Math.abs(pos1[2] - pos2[2]) < (dim1.depth + dim2.depth) / 2;

        if (overlapX && overlapZ) {
          // Collision detected
          if (!collisions[furniture1.id]) {
            collisions[furniture1.id] = [];
          }
          if (!collisions[furniture2.id]) {
            collisions[furniture2.id] = [];
          }
          collisions[furniture1.id].push(furniture2.id);
          collisions[furniture2.id].push(furniture1.id);
        }
      }
    }

    // Set collision state for this specific item
    setHasCollision(collisions[item.id] && collisions[item.id].length > 0);

    onCollisionUpdate(collisions);
  };

  // Run collision detection when furniture positions change
  useEffect(() => {
    detectCollisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFurniture, item.position, item.rotation, item.scale, onCollisionUpdate]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onSelect();
    
    // Only allow dragging if the item is not selected (no transform controls active)
    if (!isSelected) {
      setIsDragging(true);
      
      // Calculate drag offset
      const point = e.point;
      const currentPos = item.position || [0, 0, 0];
      setDragOffset([
        point.x - currentPos[0],
        point.y - currentPos[1], 
        point.z - currentPos[2]
      ]);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging || isSelected) return;
    
    const point = e.point;
    const newPosition: [number, number, number] = [
      point.x - dragOffset[0],
      point.y - dragOffset[1],
      point.z - dragOffset[2]
    ];
    
    // Keep furniture on the ground (y = 0)
    newPosition[1] = 0;
    
    updateFurniture(item.id, { position: newPosition });
  };

  useFrame(() => {
    if (isDragging && meshRef.current && !isSelected) {
      meshRef.current.position.y = 0.1; // Slight lift while dragging
    } else if (meshRef.current) {
      meshRef.current.position.y = 0; // Back to ground
    }
  });

  // Add selection outline
  const renderSelectionOutline = () => {
    if (!isSelected) return null;
    
    const position = item.position || [0, 0, 0];
    const rotation = item.rotation || [0, 0, 0];
    const scale = item.scale || [1, 1, 1];
    
    // Get outline dimensions based on furniture type
    const getOutlineDimensions = () => {
      switch (item.type) {
        case 'table':
          return { width: 2.1, height: 0.15, depth: 1.1, y: 0.05 };
        case 'chair':
          return { width: 0.6, height: 0.15, depth: 0.6, y: 0.05 };
        case 'desk':
          return { width: 1.6, height: 0.15, depth: 0.9, y: 0.05 };
        case 'shelf':
          return { width: 1.1, height: 0.15, depth: 0.4, y: 0.05 };
        case 'cabinet':
          return { width: 1.1, height: 0.15, depth: 0.6, y: 0.05 };
        case 'sofa':
          return { width: 2.1, height: 0.15, depth: 0.9, y: 0.05 };
        case 'bed':
          return { width: 2.1, height: 0.15, depth: 1.7, y: 0.05 };
        case 'lamp':
          return { width: 0.3, height: 0.15, depth: 0.3, y: 0.05 };
        default:
          return { width: 1.1, height: 0.15, depth: 1.1, y: 0.05 };
      }
    };
    
    const dimensions = getOutlineDimensions();
    
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh position={[0, dimensions.y, 0]}>
          <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
        </mesh>
      </group>
    );
  };

  // Add bounding box visualization
  const renderBoundingBox = () => {
    if (!showBoundingBox) return null;
    
    const position = item.position || [0, 0, 0];
    const rotation = item.rotation || [0, 0, 0];
    const scale = item.scale || [1, 1, 1];
    
    // Get bounding box dimensions based on furniture type
    const getBoundingBoxDimensions = () => {
      switch (item.type) {
        case 'table':
          return { width: 2.2, height: 1.6, depth: 1.2, y: 0.8 };
        case 'chair':
          return { width: 0.7, height: 1.5, depth: 0.7, y: 0.75 };
        case 'desk':
          return { width: 1.7, height: 1.6, depth: 1.0, y: 0.8 };
        case 'shelf':
          return { width: 1.2, height: 1.4, depth: 0.5, y: 0.7 };
        case 'cabinet':
          return { width: 1.2, height: 1.8, depth: 0.7, y: 0.9 };
        case 'sofa':
          return { width: 2.2, height: 1.0, depth: 1.0, y: 0.5 };
        case 'bed':
          return { width: 2.2, height: 0.8, depth: 1.8, y: 0.4 };
        case 'lamp':
          return { width: 0.4, height: 1.2, depth: 0.4, y: 0.6 };
        default:
          return { width: 1.2, height: 1.5, depth: 1.2, y: 0.75 };
      }
    };
    
    const dimensions = getBoundingBoxDimensions();
    
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh position={[0, dimensions.y, 0]}>
          <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
          <meshBasicMaterial 
            color={hasCollision ? "#ff0000" : "#ff6b35"} 
            wireframe={true} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      </group>
    );
  };

  const renderFurniture = () => {
    const position = item.position || [0, 0, 0];
    const rotation = item.rotation || [0, 0, 0];
    const scale = item.scale || [1, 1, 1];

    // Use red color if there's a collision, otherwise use normal colors
    const getMaterialColor = (defaultColor: string) => {
      return hasCollision ? "#ff0000" : defaultColor;
    };

    switch (item.type) {
      case 'table':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Table top */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.08, 1]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['top-1-color'] || item.color)} />
            </mesh>
            {/* Table legs - 4 corners */}
            {[
              [-0.85, -0.45], // Front left
              [0.85, -0.45],  // Front right
              [-0.85, 0.45],  // Back left
              [0.85, 0.45],   // Back right
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.375, pos[1]]} castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.75]} />
                <meshStandardMaterial color={getMaterialColor(item.customization['legs-1-color'] || "#654321")} />
              </mesh>
            ))}
          </group>
        );

      case 'chair':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Seat */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.08, 0.5]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['seat-1-color'] || item.color)} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.75, -0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.6, 0.08]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['seat-1-color'] || item.color)} />
            </mesh>
            {/* Chair legs - 4 corners */}
            {[
              [-0.2, -0.2], // Front left
              [0.2, -0.2],  // Front right
              [-0.2, 0.2],  // Back left
              [0.2, 0.2],   // Back right
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.225, pos[1]]} castShadow receiveShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.45]} />
                <meshStandardMaterial color={getMaterialColor(item.customization['frame-1-color'] || "#333")} />
              </mesh>
            ))}
          </group>
        );

      case 'desk':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Desktop */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.1, 0.8]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['surface-1-color'] || item.color)} />
            </mesh>
            {/* Desk legs */}
            {[
              [-0.6, -0.3],
              [0.6, -0.3],
              [-0.6, 0.3],
              [0.6, 0.3],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.375, pos[1]]} castShadow receiveShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.75]} />
                <meshStandardMaterial color={getMaterialColor(item.customization['legs-3-color'] || "#333")} />
              </mesh>
            ))}
          </group>
        );

      case 'shelf':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Shelf structure */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[1, 0.05, 0.3]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['shelves-1-color'] || item.color)} />
            </mesh>
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[1, 0.05, 0.3]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['shelves-1-color'] || item.color)} />
            </mesh>
            {/* Side panels */}
            <mesh position={[-0.5, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.05, 1.2, 0.3]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['sides-1-color'] || "#8B4513")} />
            </mesh>
            <mesh position={[0.5, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.05, 1.2, 0.3]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['sides-1-color'] || "#8B4513")} />
            </mesh>
          </group>
        );

      case 'cabinet':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Cabinet body */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[1, 1.5, 0.5]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['frame-2-color'] || item.color)} />
            </mesh>
            {/* Cabinet doors */}
            <mesh position={[0, 0.75, 0.25]} castShadow receiveShadow>
              <boxGeometry args={[0.9, 1.4, 0.02]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['doors-1-color'] || "#8B4513")} />
            </mesh>
          </group>
        );

      case 'sofa':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Sofa base */}
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.8, 0.8]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['cushion-1-color'] || item.color)} />
            </mesh>
            {/* Sofa back */}
            <mesh position={[0, 0.8, -0.3]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.8, 0.2]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['cushion-1-color'] || item.color)} />
            </mesh>
            {/* Sofa legs */}
            {[
              [-0.8, -0.3],
              [0.8, -0.3],
              [-0.8, 0.3],
              [0.8, 0.3],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.2, pos[1]]} castShadow receiveShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.4]} />
                <meshStandardMaterial color={getMaterialColor(item.customization['legs-4-color'] || "#333")} />
              </mesh>
            ))}
          </group>
        );

      case 'bed':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Bed frame */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.6, 1.6]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['frame-4-color'] || item.color)} />
            </mesh>
            {/* Mattress */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.9, 0.2, 1.5]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['mattress-1-color'] || "#8B4513")} />
            </mesh>
          </group>
        );

      case 'lamp':
        return (
          <group 
            ref={meshRef}
            position={position} 
            rotation={rotation} 
            scale={scale} 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
          >
            {/* Lamp base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['base-1-color'] || item.color)} />
            </mesh>
            {/* Lamp stand */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.5]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['base-1-color'] || "#333")} />
            </mesh>
            {/* Lamp shade */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.2]} />
              <meshStandardMaterial color={getMaterialColor(item.customization['shade-1-color'] || "#F5F5DC")} />
            </mesh>
          </group>
        );

      default:
        return (
          <group ref={meshRef}>
            <mesh 
              position={position} 
              rotation={rotation} 
              scale={scale} 
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerUp}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={getMaterialColor(item.color)} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <>
      {renderFurniture()}
      {renderSelectionOutline()}
      {renderBoundingBox()}
    </>
  );
});

export default memo(Furniture3D);
