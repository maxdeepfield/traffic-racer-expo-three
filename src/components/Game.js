import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Player from './Player';
import Track from './Track';
import Obstacles from './Obstacles';
import Coins from './Coins';

export default function Game({ lane = 1, onScoreUpdate, onGameOver }) {
  const [gameState, setGameState] = useState({
    score: 0,
    gameOver: false,
    speed: 0.15,
    paused: false,
  });

  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0.5, 0));
  const [gameStarted, setGameStarted] = useState(false);
  const { camera } = useThree();
  const playerRef = useRef();
  const startDelayRef = useRef(0);

  useEffect(() => {
    setGameState({
      score: 0,
      gameOver: false,
      speed: 0.15,
      paused: false,
    });
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

  useFrame((state, delta) => {
    if (gameState.gameOver || gameState.paused) return;

    startDelayRef.current += delta;
    if (startDelayRef.current > 0.5 && !gameStarted) {
      setGameStarted(true);
    }

    if (playerRef.current) {
      const getWorldPos = playerRef.current.getWorldPosition;
      let pos = getWorldPos ? getWorldPos() : playerRef.current.position;
      const worldPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      setPlayerPosition(worldPos.clone());

      // Camera follows behind and above player
      const targetCameraPos = new THREE.Vector3(worldPos.x * 0.3, worldPos.y + 6, worldPos.z + 12);
      const lookAheadPos = new THREE.Vector3(worldPos.x * 0.5, worldPos.y + 1, worldPos.z - 15);

      camera.position.lerp(targetCameraPos, 0.1);
      camera.lookAt(lookAheadPos);
    }

    setGameState(prev => {
      if (prev.gameOver || prev.paused) return prev;
      // Double points when on left side (oncoming traffic lanes, x < 0)
      const multiplier = playerPosition.x < 0 ? 2 : 1;
      const newScore = prev.score + delta * 15 * (1 + prev.speed * 2) * multiplier;
      if (onScoreUpdate) onScoreUpdate(Math.floor(newScore));
      return {
        ...prev,
        speed: Math.min(prev.speed + delta * 0.002, 0.4),
        score: newScore,
      };
    });
  });

  const handleGameOver = () => {
    setGameState(prev => ({ ...prev, gameOver: true }));
    if (onGameOver) onGameOver();
  };

  const handleCoinCollect = () => {
    setGameState(prev => ({ ...prev, score: prev.score + 50 }));
  };

  return (
    <>
      {/* Sky gradient effect */}
      <color attach="background" args={['#1a1a2e']} />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, playerPosition.z - 500]}>
        <planeGeometry args={[200, 1500]} />
        <meshStandardMaterial color="#1a3d1a" />
      </mesh>

      {/* Lighting - no shadows for performance */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 30, 10]} intensity={0.6} />

      <Player
        ref={playerRef}
        position={[0, 0.5, 0]}
        speed={gameState.speed}
        lane={lane}
        onGameOver={handleGameOver}
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
}
