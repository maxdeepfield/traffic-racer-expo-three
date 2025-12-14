import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 4 lanes: positions match traffic car lanes
const LANE_POSITIONS = [-3.5, -1.2, 1.2, 3.5];

const Player = forwardRef(({ position, speed, lane = 1 }, ref) => {
  const groupRef = useRef();
  const positionRef = useRef(new THREE.Vector3(...position));
  const currentXRef = useRef(LANE_POSITIONS[lane]);

  useImperativeHandle(ref, () => ({
    position: positionRef.current,
    getWorldPosition: () => positionRef.current,
  }));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth lane transition
    const targetX = LANE_POSITIONS[lane];
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetX, delta * 10);
    positionRef.current.x = currentXRef.current;

    // Move forward
    positionRef.current.z -= speed;

    // Update group position directly
    groupRef.current.position.x = positionRef.current.x;
    groupRef.current.position.y = positionRef.current.y;
    groupRef.current.position.z = positionRef.current.z;

    // Tilt car based on lane change
    const tiltAngle = (targetX - currentXRef.current) * 0.1;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltAngle, delta * 5);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Rotate car 180° to face forward (player moves in -Z direction) */}
      <group rotation={[0, Math.PI, 0]}>
      {/* Car body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.6, 0.5, 3.5]} />
        <meshStandardMaterial color="#66ccff" />
      </mesh>
      {/* Car cabin */}
      <mesh position={[0, 0.8, -0.2]}>
        <boxGeometry args={[1.4, 0.4, 1.8]} />
        <meshStandardMaterial color="#55aadd" />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.8, 0.8]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.3, 0.35, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
      </mesh>
      {/* Rear window */}
      <mesh position={[0, 0.8, -1.2]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.3, 0.35, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
      </mesh>
      {/* Wheels */}
      {[[-0.7, 0.2, 1], [0.7, 0.2, 1], [-0.7, 0.2, -1.2], [0.7, 0.2, -1.2]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
      {/* Headlight meshes */}
      <mesh position={[-0.5, 0.4, 1.76]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
      </mesh>
      <mesh position={[0.5, 0.4, 1.76]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={5} />
      </mesh>
      {/* Headlight beams */}
      <pointLight position={[-0.5, 0.4, 2.5]} intensity={4} distance={15} color="#ffffee" />
      <pointLight position={[0.5, 0.4, 2.5]} intensity={4} distance={15} color="#ffffee" />
      {/* Taillight meshes - red cubes */}
      <mesh position={[-0.5, 0.4, -1.76]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#cc0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.5, 0.4, -1.76]}>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#cc0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      {/* Taillight glows */}
      <pointLight position={[-0.5, 0.4, -2]} intensity={2} distance={6} color="#ff0000" />
      <pointLight position={[0.5, 0.4, -2]} intensity={2} distance={6} color="#ff0000" />
      </group>
    </group>
  );
});

Player.displayName = 'Player';
export default Player;
