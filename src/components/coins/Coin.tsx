import React, { useRef, useEffect } from 'react';
import { useFrame, RootState } from '@react-three/fiber';
import * as THREE from 'three';
import type { Position3 } from '../../types';

interface CoinProps {
  position: Position3;
  onCollect: () => void;
  playerPosition: THREE.Vector3 | null;
  gameStarted: boolean;
  collected: boolean;
}

export const Coin: React.FC<CoinProps> = ({
  position,
  onCollect,
  playerPosition,
  gameStarted,
  collected,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const hasBeenCollectedRef = useRef(false);
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!collected) {
      hasBeenCollectedRef.current = false;
      if (groupRef.current) groupRef.current.visible = true;
    }
  }, [collected, position[2]]);

  useFrame((state: RootState, delta: number) => {
    if (!groupRef.current || !playerPosition || !gameStarted || hasBeenCollectedRef.current) return;

    rotationRef.current += delta * 4;
    groupRef.current.rotation.y = rotationRef.current;
    groupRef.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.2;

    const coinPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(coinPos);

    const distanceX = Math.abs(coinPos.x - playerPosition.x);
    const distanceZ = Math.abs(coinPos.z - playerPosition.z);

    if (distanceX < 1.5 && distanceZ < 2) {
      hasBeenCollectedRef.current = true;
      groupRef.current.visible = false;
      onCollect();
    }
  });

  return (
    <group ref={groupRef} position={[position[0], 1.2, position[2]]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
};
