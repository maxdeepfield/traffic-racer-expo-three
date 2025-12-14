import React from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { Canvas } from '@react-three/fiber';
import Game from './src/components/Game';

export default function App() {
  const [steerX, setSteerX] = React.useState(0); // -1 to 1 steering position
  const [score, setScore] = React.useState(0);
  const [finalScore, setFinalScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameKey, setGameKey] = React.useState('initial');

  // Touch tracking
  const touchActiveRef = React.useRef(false);
  const screenWidthRef = React.useRef(400);

  // Handle touch start
  const handleTouchStart = (e) => {
    if (gameOver) return;
    if (e.preventDefault) e.preventDefault();
    
    touchActiveRef.current = true;
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX || touch.pageX;
    screenWidthRef.current = window.innerWidth || 400;
    
    // Convert touch position to steering (-1 to 1)
    const normalizedX = (x / screenWidthRef.current) * 2 - 1;
    setSteerX(normalizedX);
  };

  // Handle touch move - continuous steering
  const handleTouchMove = (e) => {
    if (gameOver || !touchActiveRef.current) return;
    if (e.preventDefault) e.preventDefault();
    
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX || touch.pageX;
    
    // Convert touch position to steering (-1 to 1)
    const normalizedX = (x / screenWidthRef.current) * 2 - 1;
    setSteerX(normalizedX);
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    if (gameOver) return;
    touchActiveRef.current = false;
    // Keep last steering position (no auto-center)
  };

  // Restart game function
  const restartGame = () => {
    setFinalScore(score);
    setGameOver(false);
    setScore(0);
    setSteerX(0);
    setGameKey(prev => prev + '-restart');
  };

  // Prevent browser gestures on mount
  React.useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    document.documentElement.style.touchAction = 'none';
    
    return () => {
      document.body.style.overscrollBehavior = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overscrollBehavior = '';
      document.documentElement.style.touchAction = '';
    };
  }, []);

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={(e) => touchActiveRef.current && handleTouchMove(e)}
      onMouseUp={handleTouchEnd}
    >
      <StatusBar barStyle="light-content" />
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75 }}
        gl={{ antialias: false }}
      >
        <Game
          key={gameKey}
          steerX={steerX}
          onScoreUpdate={setScore}
          onGameOver={() => {
            setFinalScore(score);
            setGameOver(true);
          }}
        />
      </Canvas>

      {/* Score display */}
      {!gameOver && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{Math.floor(score)}</Text>
        </View>
      )}

      {/* Game Over overlay */}
      {gameOver && (
        <View
          style={styles.gameOverContainer}
          onStartShouldSetResponder={() => true}
          onResponderRelease={restartGame}
          onTouchEnd={restartGame}
          onClick={restartGame}
        >
          <Text style={styles.gameOverText}>CRASH!</Text>
          <Text style={styles.finalScoreText}>{Math.floor(finalScore)}</Text>
          <Text style={styles.tapText}>Tap to restart</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scoreText: {
    color: '#00ff88',
    fontSize: 48,
    fontWeight: 'bold',
  },
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
  gameOverText: {
    color: '#ff4444',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScoreText: {
    color: '#00ff88',
    fontSize: 48,
    fontWeight: 'bold',
  },
  tapText: {
    color: '#888',
    fontSize: 20,
    marginTop: 30,
  },
});
