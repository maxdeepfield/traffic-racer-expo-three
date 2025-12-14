import React from 'react';

interface CarLightsProps {
  isPlayer?: boolean;
}

export const CarHeadlights: React.FC<CarLightsProps> = ({ isPlayer = false }) => {
  if (isPlayer) {
    return (
      <>
        <mesh position={[-0.5, 0.4, 1.76]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
        </mesh>
        <mesh position={[0.5, 0.4, 1.76]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
        </mesh>
        <pointLight position={[-0.5, 0.4, 2.5]} intensity={4} distance={15} color="#ffffee" />
        <pointLight position={[0.5, 0.4, 2.5]} intensity={4} distance={15} color="#ffffee" />
      </>
    );
  }

  return (
    <>
      <mesh position={[-0.45, 0.35, 1.61]}>
        <boxGeometry args={[0.25, 0.12, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
      </mesh>
      <mesh position={[0.45, 0.35, 1.61]}>
        <boxGeometry args={[0.25, 0.12, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
      </mesh>
      <spotLight position={[-0.45, 0.35, 1.8]} angle={0.5} penumbra={0.5} intensity={5} distance={20} color="#ffffee" />
      <spotLight position={[0.45, 0.35, 1.8]} angle={0.5} penumbra={0.5} intensity={5} distance={20} color="#ffffee" />
    </>
  );
};

export const CarTaillights: React.FC<CarLightsProps> = ({ isPlayer = false }) => {
  const y = isPlayer ? 0.4 : 0.35;
  const meshZ = isPlayer ? -1.76 : -1.61;
  const lightZ = isPlayer ? -2 : -1.8;

  return (
    <>
      <mesh position={[-0.45, y, meshZ]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#cc0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.45, y, meshZ]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#cc0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[-0.45, y, lightZ]} intensity={2} distance={6} color="#ff0000" />
      <pointLight position={[0.45, y, lightZ]} intensity={2} distance={6} color="#ff0000" />
    </>
  );
};
