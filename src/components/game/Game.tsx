import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from '../player';
import { Track } from '../track';
import { Obstacles } from '../obstacles';
import { Coins } from '../coins';
import { GameScene } from './GameScene';
import type { GameState, PlayerRef } from '../../types';

interface GameProps {
  lane?: number;
  onScoreUpdate?: (score: number) => void;
  onGameOver?: () => void;
}

const INITIAL_STATE: GameState = {
  score: 0,
  gameOver: false,
  speed: 0.15,
  paused: false,
};

const Game: React.FC<GameProps> = ({ lane = 1, onScoreUpdate, onGameOver }) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 0));
  const [gameStarted, setGameStarted] = useState(false);

  const { camera } = useThree();
  const playerRef = useRef<PlayerRef>(null);
  const startDelayRef = useRef(0);

  useEffect(() => {
    setGameState(INITIAL_STATE);
    setPlayerPosition(new THREE.Vector3(0, 0.5, 0));
    setGameStarted(false);
    startDelayRef.current = 0;
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setGameState(prev => ({ ...prev, paused: document.hidden }));
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useFrame((_, delta) => {
    if (gameState.gameOver || gameState.paused) return;

    startDelayRef.current += delta;
    if (startDelayRef.current > 0.5 && !gameStarted) {
      setGameStarted(true);
    }

    if (playerRef.current) {
      const pos = playerRef.current.getWorldPosition();
      const worldPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      setPlayerPosition(worldPos.clone());

      const targetCameraPos = new THREE.Vector3(worldPos.x * 0.3, worldPos.y + 6, worldPos.z + 12);
      const lookAheadPos = new THREE.Vector3(worldPos.x * 0.5, worldPos.y + 1, worldPos.z - 15);

      camera.position.lerp(targetCameraPos, 0.1);
      camera.lookAt(lookAheadPos);
    }

    setGameState(prev => {
      if (prev.gameOver || prev.paused) return prev;
      const multiplier = playerPosition.x < 0 ? 2 : 1;
      const newScore = prev.score + delta * 15 * (1 + prev.speed * 2) * multiplier;
      onScoreUpdate?.(Math.floor(newScore));
      return {
        ...prev,
        speed: Math.min(prev.speed + delta * 0.002, 0.4),
        score: newScore,
      };
    });
  });

  const handleGameOver = () => {
    setGameState(prev => ({ ...prev, gameOver: true }));
    onGameOver?.();
  };

  const handleCoinCollect = () => {
    setGameState(prev => ({ ...prev, score: prev.score + 50 }));
  };

  return (
    <>
      <GameScene playerPosition={playerPosition} />

      <Player
        ref={playerRef}
        position={[0, 0.5, 0]}
        speed={gameState.speed}
        lane={lane}
      />

      <Track speed={gameState.speed} playerPosition={playerPosition} />

      <Obstacles
        speed={gameState.speed}
        onCollision={handleGameOver}
        playerPosition={playerPosition}
        gameStarted={gameStarted && !gameState.gameOver && !gameState.paused}
      />

      <Coins
        speed={gameState.speed}
        onCollect={handleCoinCollect}
        playerPosition={playerPosition}
        gameStarted={gameStarted && !gameState.gameOver && !gameState.paused}
      />
    </>
  );
};

export default Game;
