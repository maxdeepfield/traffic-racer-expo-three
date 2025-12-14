import React from 'react';
import type { Position3 } from '../../types';

interface CarWheelsProps {
  isPlayer?: boolean;
}

const PLAYER_WHEEL_POSITIONS: Position3[] = [
  [-0.7, 0.2, 1],
  [0.7, 0.2, 1],
  [-0.7, 0.2, -1.2],
  [0.7, 0.2, -1.2],
];

const TRAFFIC_WHEEL_POSITIONS: Position3[] = [
  [-0.65, 0.18, 0.9],
  [0.65, 0.18, 0.9],
  [-0.65, 0.18, -1.1],
  [0.65, 0.18, -1.1],
];

export const CarWheels: React.FC<CarWheelsProps> = ({ isPlayer = false }) => {
  const positions = isPlayer ? PLAYER_WHEEL_POSITIONS : TRAFFIC_WHEEL_POSITIONS;
  const radius = isPlayer ? 0.3 : 0.25;
  const width = isPlayer ? 0.2 : 0.18;
  const segments = isPlayer ? 12 : 10;
  const color = isPlayer ? '#222' : '#111';

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow={!isPlayer}>
          <cylinderGeometry args={[radius, radius, width, segments]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </>
  );
};
