import React from 'react';

interface CarBodyProps {
  color: string;
  isPlayer?: boolean;
}

export const CarBody: React.FC<CarBodyProps> = ({ color, isPlayer = false }) => {
  if (isPlayer) {
    return (
      <>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.6, 0.5, 3.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.8, -0.2]}>
          <boxGeometry args={[1.4, 0.4, 1.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </>
    );
  }

  return (
    <>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.45, 3.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.7, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.35, 1.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
};
