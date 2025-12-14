import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CarBody, CarWindows, CarWheels, CarHeadlights, CarTaillights } from '../car';
import { LANE_POSITIONS } from '../../constants/game';
import type { PlayerRef, Position3 } from '../../types';

interface PlayerProps {
  position: Position3;
  speed: number;
  lane?: number;
}

const PLAYER_COLOR = '#66ccff';

const Player = forwardRef<PlayerRef, PlayerProps>(({ position, speed, lane = 1 }, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const positionRef = useRef(new THREE.Vector3(...position));
  const currentXRef = useRef<number>(LANE_POSITIONS[lane]);

  useImperativeHandle(ref, () => ({
    position: positionRef.current,
    getWorldPosition: () => positionRef.current,
  }));

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetX = LANE_POSITIONS[lane];
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetX, delta * 10);
    positionRef.current.x = currentXRef.current;
    positionRef.current.z -= speed;

    groupRef.current.position.copy(positionRef.current);

    const tiltAngle = (targetX - currentXRef.current) * 0.1;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltAngle, delta * 5);
  });

  return (
    <group ref={groupRef} position={position}>
      <group rotation={[0, Math.PI, 0]}>
        <CarBody color={PLAYER_COLOR} isPlayer />
        <CarWindows isPlayer />
        <CarWheels isPlayer />
        <CarHeadlights isPlayer />
        <CarTaillights isPlayer />
      </group>
    </group>
  );
});

Player.displayName = 'Player';
export default Player;
