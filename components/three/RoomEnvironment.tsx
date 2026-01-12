'use client';

import { BoxGeometry } from 'three';
import { usePlaygroundContext } from '@/contexts/PlaygroundContext';

export default function RoomEnvironment() {
  const { state } = usePlaygroundContext();
  const { width, length, height } = state.roomDimensions;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#F5F5F0" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#F5F5F0" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#F5F5F0" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Room outline for better depth perception */}
      <lineSegments>
        <edgesGeometry args={[new BoxGeometry(width, height, length)]} />
        <lineBasicMaterial color="#e0e0e0" opacity={0.3} transparent />
      </lineSegments>

      {/* Baseboard */}
      <mesh position={[0, 0.05, -length / 2 + 0.025]}>
        <boxGeometry args={[width, 0.1, 0.05]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>

      <mesh position={[-width / 2 + 0.025, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.1, length]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>

      <mesh position={[width / 2 - 0.025, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.1, length]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>
    </group>
  );
}
