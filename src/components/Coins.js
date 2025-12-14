import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROAD_WIDTH = 10;
const COIN_SPACING = 20;
const COIN_COUNT = 10;

function Coin({ position, onCollect, playerPosition, gameStarted, collected }) {
  const groupRef = useRef();
  const hasBeenCollectedRef = useRef(false);
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!collected) {
      hasBeenCollectedRef.current = false;
      if (groupRef.current) groupRef.current.visible = true;
    }
  }, [collected, position[2]]);

  useFrame((state, delta) => {
    if (!groupRef.current || !playerPosition || !gameStarted || hasBeenCollectedRef.current) return;

    rotationRef.current += delta * 4;
    groupRef.current.rotation.y = rotationRef.current;
    groupRef.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.2;

    const coinPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(coinPos);

    const distanceX = Math.abs(coinPos.x - playerPosition.x);
    const distanceZ = Math.abs(coinPos.z - playerPosition.z);

    if (distanceX < 1.5 && distanceZ < 2) {
      hasBeenCollectedRef.current = true;
      groupRef.current.visible = false;
      onCollect();
    }
  });

  return (
    <group ref={groupRef} position={[position[0], 1.2, position[2]]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}


export default function Coins({ speed, onCollect, playerPosition, gameStarted = true }) {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const initialCoins = [];
    for (let i = 0; i < COIN_COUNT; i++) {
      // Random X position across road width
      const x = (Math.random() - 0.5) * (ROAD_WIDTH - 2);
      initialCoins.push({
        id: `coin-${i}`,
        x,
        z: -15 - i * COIN_SPACING - Math.random() * 10,
        collected: false,
      });
    }
    setCoins(initialCoins);
  }, []);

  const handleCoinCollect = (coinId) => {
    setCoins(prev => prev.map(coin => 
      coin.id === coinId ? { ...coin, collected: true } : coin
    ));
    onCollect();
  };

  useFrame(() => {
    if (!playerPosition) return;

    setCoins(prev => {
      const playerZ = playerPosition.z;
      const furthestZ = Math.min(...prev.map(c => c.z));

      return prev.map(coin => {
        const newZ = coin.z + speed * 0.7;

        if (newZ > playerZ + 20) {
          const x = (Math.random() - 0.5) * (ROAD_WIDTH - 2);
          return {
            ...coin,
            x,
            z: furthestZ - COIN_SPACING - Math.random() * 10,
            collected: false,
          };
        }
        return { ...coin, z: newZ };
      });
    });
  });

  return (
    <>
      {coins.map(coin => (
        <Coin
          key={coin.id}
          position={[coin.x, 1.2, coin.z]}
          onCollect={() => handleCoinCollect(coin.id)}
          playerPosition={playerPosition}
          gameStarted={gameStarted}
          collected={coin.collected}
        />
      ))}
    </>
  );
}
