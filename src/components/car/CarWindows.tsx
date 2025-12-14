import React from 'react';

interface CarWindowsProps {
  isPlayer?: boolean;
}

export const CarWindows: React.FC<CarWindowsProps> = ({ isPlayer = false }) => {
  if (isPlayer) {
    return (
      <>
        <mesh position={[0, 0.8, 0.8]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.3, 0.35, 0.05]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0.8, -1.2]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[1.3, 0.35, 0.05]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
        </mesh>
      </>
    );
  }

  return (
    <mesh position={[0, 0.7, 0.7]} rotation={[0.25, 0, 0]} castShadow>
      <boxGeometry args={[1.2, 0.3, 0.05]} />
      <meshStandardMaterial color="#334455" />
    </mesh>
  );
};
