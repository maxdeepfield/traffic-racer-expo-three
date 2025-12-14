import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { Game } from './src/components';

export default function App() {
  const [lane, setLane] = useState(2);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameKey, setGameKey] = useState('initial');

  const startXRef = useRef(0);

  const moveLeft = useCallback(() => {
    if (gameOver) return;
    setLane(prev => Math.max(prev - 1, 0));
  }, [gameOver]);

  const moveRight = useCallback(() => {
    if (gameOver) return;
    setLane(prev => Math.min(prev + 1, 3));
  }, [gameOver]);

  const restartGame = useCallback(() => {
    setFinalScore(score);
    setGameOver(false);
    setScore(0);
    setLane(1);
    setGameKey(prev => prev + '-restart');
  }, [score]);

  const handleGameOver = useCallback(() => {
    setFinalScore(score);
    setGameOver(true);
  }, [score]);

  // Keyboard controls (WASD + Arrows)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'd':
        case 'D':
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, moveLeft, moveRight]);

  // Touch/swipe controls for web
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.touchAction = 'none';

    const handleTouchStart = (e: TouchEvent) => {
      if (gameOver) return;
      e.preventDefault();
      startXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameOver) return;
      e.preventDefault();
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startXRef.current;

      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          moveRight();
        } else {
          moveLeft();
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (gameOver) return;
      startXRef.current = e.clientX;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (gameOver) return;
      const diff = e.clientX - startXRef.current;

      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          moveRight();
        } else {
          moveLeft();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overscrollBehavior = '';
      document.documentElement.style.touchAction = '';
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameOver, moveLeft, moveRight]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }} gl={{ antialias: false }}>
        <Game
          key={gameKey}
          lane={lane}
          onScoreUpdate={setScore}
          onGameOver={handleGameOver}
        />
      </Canvas>

      {!gameOver && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{Math.floor(score)}</Text>
        </View>
      )}

      {gameOver && (
        <View
          style={styles.gameOverContainer}
          onStartShouldSetResponder={() => true}
          onResponderRelease={restartGame}
        >
          <Text style={styles.gameOverText}>CRASH!</Text>
          <Text style={styles.finalScoreText}>{Math.floor(finalScore)}</Text>
          <Text style={styles.tapText}>Tap to restart (or press any key)</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  scoreContainer: { position: 'absolute', top: 50, left: 0, right: 0, alignItems: 'center' },
  scoreText: { color: '#00ff88', fontSize: 48, fontWeight: 'bold' },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  gameOverText: { color: '#ff4444', fontSize: 64, fontWeight: 'bold', marginBottom: 20 },
  finalScoreText: { color: '#00ff88', fontSize: 48, fontWeight: 'bold' },
  tapText: { color: '#888', fontSize: 20, marginTop: 30 },
});
