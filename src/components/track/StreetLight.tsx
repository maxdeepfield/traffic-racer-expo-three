import React from 'react';
import { TRACK_WIDTH } from '../../constants/game';

interface StreetLightProps {
  z: number;
  side: 'left' | 'right';
}

export const StreetLight: React.FC<StreetLightProps> = ({ z, side }) => {
  const xSign = side === 'left' ? -1 : 1;
  const poleX = xSign * (TRACK_WIDTH / 2 + 2);
  const armX = xSign * (TRACK_WIDTH / 2 + 1);
  const bulbX = xSign * (TRACK_WIDTH / 2 + 0.5);

  return (
    <group>
      <mesh position={[poleX, 3, z]}>
        <cylinderGeometry args={[0.1, 0.15, 6]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[armX, 5.8, z]}>
        <boxGeometry args={[2, 0.1, 0.3]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[bulbX, 5.6, z]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffeeaa" emissiveIntensity={10} />
      </mesh>
      <pointLight position={[bulbX, 5.5, z]} intensity={4} distance={25} color="#ffeecc" />
    </group>
  );
};
