import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TrafficCar } from './TrafficCar';
import { CAR_SPACING, CAR_COUNT, CAR_COLORS, RIGHT_LANES, LEFT_LANES } from '../../constants/game';
import type { CarData } from '../../types';

interface ObstaclesProps {
  speed: number;
  onCollision: () => void;
  playerPosition: THREE.Vector3 | null;
  gameStarted?: boolean;
}

const Obstacles: React.FC<ObstaclesProps> = ({
  speed,
  onCollision,
  playerPosition,
  gameStarted = true,
}) => {
  const [cars, setCars] = useState<CarData[]>([]);
  const carZRefs = useRef<Record<number, number>>({});

  useEffect(() => {
    const initialCars: CarData[] = [];
    for (let i = 0; i < CAR_COUNT; i++) {
      const isOncoming = i % 2 === 0;
      const lanes = isOncoming ? [...LEFT_LANES] : [...RIGHT_LANES];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
      const z = -15 - i * (CAR_SPACING / 2) - Math.random() * 8;
      initialCars.push({ id: i, x: lane, z, color, isOncoming });
      carZRefs.current[i] = z;
    }
    setCars(initialCars);
  }, []);

  useFrame(() => {
    if (!playerPosition) return;
    const playerZ = playerPosition.z;

    setCars(prev => {
      let needsUpdate = false;
      const updated = prev.map(car => {
        const currentZ = carZRefs.current[car.id] ?? car.z;
        if (currentZ > playerZ + 40) {
          needsUpdate = true;
          const lanes = car.isOncoming ? [...LEFT_LANES] : [...RIGHT_LANES];
          const lane = lanes[Math.floor(Math.random() * lanes.length)];
          const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
          const newZ = playerZ - 80 - Math.random() * 30;
          carZRefs.current[car.id] = newZ;
          return { ...car, x: lane, z: newZ, color };
        }
        return car;
      });
      return needsUpdate ? updated : prev;
    });
  });

  const handleUpdateZ = (id: number, z: number) => {
    carZRefs.current[id] = z;
  };

  return (
    <>
      {cars.map(car => (
        <TrafficCar
          key={car.id}
          position={[car.x, 0, car.z]}
          onCollision={onCollision}
          playerPosition={playerPosition}
          gameStarted={gameStarted}
          color={car.color}
          carSpeed={speed}
          isOncoming={car.isOncoming}
          onUpdateZ={(z) => handleUpdateZ(car.id, z)}
        />
      ))}
    </>
  );
};

export default Obstacles;
