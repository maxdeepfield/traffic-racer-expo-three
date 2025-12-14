import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CarBody, CarWindows, CarWheels, CarHeadlights, CarTaillights } from '../car';
import type { Position3 } from '../../types';

interface TrafficCarProps {
  position: Position3;
  onCollision: () => void;
  playerPosition: THREE.Vector3 | null;
  gameStarted: boolean;
  color: string;
  carSpeed: number;
  isOncoming: boolean;
  onUpdateZ: (z: number) => void;
}

export const TrafficCar: React.FC<TrafficCarProps> = ({
  position,
  onCollision,
  playerPosition,
  gameStarted,
  color,
  carSpeed,
  isOncoming,
  onUpdateZ,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const localZRef = useRef(position[2]);

  useEffect(() => {
    localZRef.current = position[2];
  }, [position[2]]);

  useFrame(() => {
    if (!groupRef.current || !playerPosition || !gameStarted) return;

    if (isOncoming) {
      localZRef.current += carSpeed * 2.0;
    } else {
      localZRef.current -= carSpeed * 0.3;
    }

    const carWorldZ = localZRef.current;
    const carWorldX = position[0];

    const distanceX = Math.abs(carWorldX - playerPosition.x);
    const distanceZ = Math.abs(carWorldZ - playerPosition.z);

    if (distanceX < 1.4 && distanceZ < 2.5) {
      onCollision();
    }

    groupRef.current.position.z = localZRef.current;
    onUpdateZ(localZRef.current);
  });

  const rotation = isOncoming ? 0 : Math.PI;

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      <group rotation={[0, rotation, 0]}>
        <CarBody color={color} />
        <CarWindows />
        <CarWheels />
        <CarHeadlights />
        <CarTaillights />
      </group>
    </group>
  );
};
