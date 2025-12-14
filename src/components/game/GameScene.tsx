import React from 'react';
import * as THREE from 'three';

interface GameSceneProps {
  playerPosition: THREE.Vector3;
}

export const GameScene: React.FC<GameSceneProps> = ({ playerPosition }) => (
  <>
    <color attach="background" args={['#1a1a2e']} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, playerPosition.z - 500]}>
      <planeGeometry args={[200, 1500]} />
      <meshStandardMaterial color="#1a3d1a" />
    </mesh>
    <ambientLight intensity={0.3} />
    <directionalLight position={[10, 30, 10]} intensity={0.6} />
  </>
);
