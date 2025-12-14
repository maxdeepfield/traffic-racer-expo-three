import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROAD_WIDTH = 10;
const CAR_HALF_WIDTH = 0.8;
const MAX_X = (ROAD_WIDTH / 2) - CAR_HALF_WIDTH - 0.3;

const Player = forwardRef(({ position, speed, steerX = 0, onGameOver }, ref) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const positionRef = useRef(new THREE.Vector3(...position));
  const currentXRef = useRef(0);

  useImperativeHandle(ref, () => ({
    position: positionRef.current,
    getWorldPosition: () => {
      if (groupRef.current && meshRef.current) {
        const worldPos = new THREE.Vector3();
        meshRef.current.getWorldPosition(worldPos);
        return worldPos;
      }
      return positionRef.current;
    },
  }));

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth steering based on touch position
    const targetX = steerX * MAX_X;
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetX, delta * 8);
    
    // Clamp to road bounds
    currentXRef.current = THREE.MathUtils.clamp(currentXRef.current, -MAX_X, MAX_X);
    positionRef.current.x = currentXRef.current;

    // Move forward
    positionRef.current.z -= speed;

    // Update mesh position
    meshRef.current.position.copy(positionRef.current);

    // Tilt car based on steering
    const tiltAngle = (steerX - currentXRef.current / MAX_X) * 0.15;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, tiltAngle, delta * 5);
  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={meshRef}>
        {/* Car body */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.6, 0.5, 3.5]} />
          <meshStandardMaterial color="#ff3333" />
        </mesh>
        {/* Car cabin */}
        <mesh position={[0, 0.8, -0.2]}>
          <boxGeometry args={[1.4, 0.4, 1.8]} />
          <meshStandardMaterial color="#cc2222" />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.8, 0.8]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.3, 0.35, 0.05]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
        </mesh>
        {/* Rear window */}
        <mesh position={[0, 0.8, -1.2]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[1.3, 0.35, 0.05]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
        </mesh>
        {/* Wheels */}
        {[[-0.7, 0.2, 1], [0.7, 0.2, 1], [-0.7, 0.2, -1.2], [0.7, 0.2, -1.2]].map((pos, i) => (
          <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        ))}
        {/* Headlights */}
        <mesh position={[-0.5, 0.4, 1.76]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffff88" emissive="#ffff44" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.5, 0.4, 1.76]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffff88" emissive="#ffff44" emissiveIntensity={0.5} />
        </mesh>
        {/* Taillights */}
        <mesh position={[-0.5, 0.4, -1.76]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.5, 0.4, -1.76]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
});

Player.displayName = 'Player';
export default Player;
