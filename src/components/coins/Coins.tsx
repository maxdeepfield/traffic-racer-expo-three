import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Coin } from './Coin';
import { ROAD_WIDTH, COIN_SPACING, COIN_COUNT } from '../../constants/game';
import type { CoinData } from '../../types';

interface CoinsProps {
  speed: number;
  onCollect: () => void;
  playerPosition: THREE.Vector3 | null;
  gameStarted?: boolean;
}

const Coins: React.FC<CoinsProps> = ({
  speed,
  onCollect,
  playerPosition,
  gameStarted = true,
}) => {
  const [coins, setCoins] = useState<CoinData[]>([]);

  useEffect(() => {
    const initialCoins: CoinData[] = [];
    for (let i = 0; i < COIN_COUNT; i++) {
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

  const handleCoinCollect = (coinId: string) => {
    setCoins(prev =>
      prev.map(coin => (coin.id === coinId ? { ...coin, collected: true } : coin))
    );
    onCollect();
  };

  useFrame(() => {
    if (!playerPosition || !gameStarted) return;

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
};

export default Coins;
