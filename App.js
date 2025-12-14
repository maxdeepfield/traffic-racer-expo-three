import React from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { Canvas } from '@react-three/fiber';
import Game from './src/components/Game';

export default function App() {
  const [lane, setLane] = React.useState(2); // 0,1,2,3 = 4 lanes (start in lane 2 - first right lane)
  const [score, setScore] = React.useState(0);
  const [finalScore, setFinalScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameKey, setGameKey] = React.useState('initial');

  const startXRef = React.useRef(0);

  const handleTouchStart = (e) => {
    if (gameOver) return;
    if (e.preventDefault) e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    startXRef.current = touch.clientX || touch.pageX;
  };

  const handleTouchEnd = (e) => {
    if (gameOver) return;
    if (e.preventDefault) e.preventDefault();
    
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const endX = touch.clientX || touch.pageX;
    const diff = endX - startXRef.current;

    // Swipe threshold
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // Swipe right - move to higher lane
        setLane(prev => Math.min(prev + 1, 3));
      } else {
        // Swipe left - move to lower lane
        setLane(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const restartGame = () => {
    setFinalScore(score);
    setGameOver(false);
    setScore(0);
    setLane(1);
    setGameKey(prev => prev + '-restart');
  };

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
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      <StatusBar barStyle="light-content" />
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }} gl={{ antialias: false }}>
        <Game
          key={gameKey}
          lane={lane}
          onScoreUpdate={setScore}
          onGameOver={() => {
            setFinalScore(score);
            setGameOver(true);
          }}
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
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  scoreContainer: { position: 'absolute', top: 50, left: 0, right: 0, alignItems: 'center' },
  scoreText: { color: '#00ff88', fontSize: 48, fontWeight: 'bold' },
  gameOverContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  gameOverText: { color: '#ff4444', fontSize: 64, fontWeight: 'bold', marginBottom: 20 },
  finalScoreText: { color: '#00ff88', fontSize: 48, fontWeight: 'bold' },
  tapText: { color: '#888', fontSize: 20, marginTop: 30 },
});
